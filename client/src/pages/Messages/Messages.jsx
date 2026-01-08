import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NotificationToast from "../../components/Notification/Notification";
import { useAuth } from "../../context/AuthContext";
import { createMessage } from "../../models/message";
import { getAllClasses } from "../../models/class";
import { getGroupsByClass } from "../../models/group";
import { getAllStudents } from "../../models/user";
import "../../scss/Messages.scss";
import message from "../../assets/icons/message.png"

export default function Messages() {
  const { user } = useAuth();
  const [recipientType, setRecipientType] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [classes, setClasses] = useState([]);
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const classesRes = await getAllClasses();
        if (classesRes && classesRes.status === 200) {
          setClasses(classesRes.payload || []);
        }

        const studentsRes = await getAllStudents();
        if (studentsRes && studentsRes.status === 200) {
          setStudents(studentsRes.payload || []);
        }
      } catch (err) {
        console.error("Error loading data:", err);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadGroups = async () => {
      if (recipientType === "group" && classes.length > 0) {
        try {
          const allGroups = [];
          for (const cls of classes) {
            const groupsRes = await getGroupsByClass(cls._id);
            if (groupsRes && groupsRes.status === 200 && groupsRes.payload) {
              allGroups.push(...groupsRes.payload);
            }
          }
          setGroups(allGroups);
        } catch (err) {
          console.error("Error loading groups:", err);
        }
      } else {
        setGroups([]);
      }
    };

    loadGroups();
  }, [recipientType, classes]);

  useEffect(() => {
    setSelectedId("");
  }, [recipientType]);

  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!recipientType || !selectedId || !title || !content) {
      setError("Prosím vyplňte všechna pole");
      setLoading(false);
      return;
    }

    if (!user || !user._id) {
      setError("Uživatel není přihlášen");
      setLoading(false);
      return;
    }

    try {
      const messageData = {
        sender_id: user._id,
        title,
        content,
        class_id: recipientType === "class" ? selectedId : null,
        group_id: recipientType === "group" ? selectedId : null,
        recipient_id: recipientType === "student" ? selectedId : null
      };

      const result = await createMessage(messageData);

      if (result && result.status === 201) {
        setSuccess("Zpráva byla úspěšně odeslána");
        setRecipientType("");
        setSelectedId("");
        setTitle("");
        setContent("");
      } else {
        setError(result?.message || "Chyba při odesílání zprávy");
      }
    } catch (err) {
      setError("Chyba při odesílání zprávy");
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  const getOptions = () => {
    if (recipientType === "class") {
      return classes.map(cls => (
        <option key={cls._id} value={cls._id}>{cls.name}</option>
      ));
    } else if (recipientType === "group") {
      return groups.map(group => (
        <option key={group._id} value={group._id}>{group.name}</option>
      ));
    } else if (recipientType === "student") {
      return students.map(student => (
        <option key={student._id} value={student._id}>
          {student.first_name} {student.last_name}
        </option>
      ));
    }
    return null;
  };

  return (
    <div className="send-message-page">
      <Navbar />

      <main className="main-content">
        <section className="message-card">
          <header className="card-header">
            <div className="icon-wrapper">
                <img src={message} alt="" />
            </div>
            <h1>Odeslat zprávu</h1>
          </header>

          <form onSubmit={handleSubmit}>
            <div className="card-body">
              <div className="selection-row">
                <div className="form-group">
                  <label>Kam:</label>
                  <select
                    className="select-input"
                    value={recipientType}
                    onChange={(e) => setRecipientType(e.target.value)}
                    required
                  >
                    <option value="" disabled>Výběr...</option>
                    <option value="class">Odeslat třídě</option>
                    <option value="group">Odeslat skupině</option>
                    <option value="student">Specifickému studentovi</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Komu:</label>
                  <select
                    className="select-input"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    disabled={!recipientType}
                    required
                  >
                    <option value="" disabled>Výběr...</option>
                    {getOptions()}
                  </select>
                </div>
              </div>

              <div className="form-group full-width">
                <label>Nadpis</label>
                <input
                  type="text"
                  className="text-input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group full-width grow">
                <label>Zpráva</label>
                <textarea
                  className="text-area"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                ></textarea>
              </div>

              <footer className="card-footer">
                <button
                  type="submit"
                  className="btn-send"
                  disabled={loading}
                >
                  {loading ? "Odesílání..." : "Odeslat"}
                </button>
              </footer>
            </div>
          </form>
        </section>
      </main>

      <NotificationToast
        message={success}
        type="success"
        isVisible={!!success}
        onClose={() => setSuccess("")}
      />

      <NotificationToast
        message={error}
        type="error"
        isVisible={!!error}
        onClose={() => setError("")}
      />
    </div>
  );
}