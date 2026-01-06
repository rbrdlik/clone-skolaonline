import Navbar from "../../components/Navbar/Navbar";
import "../../scss/Messages.scss";
import message from "../../assets/icons/message.png"

export default function Messages() {
  const classes = Array(7).fill({
    id: 1,
    name: "1.Ai",
    studentCount: 27
  });

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

          <div className="card-body">
            <div className="selection-row">
              <div className="form-group">
                <label>Kam:</label>
                <select className="select-input" defaultValue="">
                  <option value="" disabled>Výběr...</option>
                  <option value="class">Odeslat třídě</option>
                  <option value="group">Odeslat skupině</option>
                  <option value="student">Specifickému studentovi</option>
                </select>
              </div>

              <div className="form-group">
                <label>Komu:</label>
                <select className="select-input" defaultValue="">
                  <option value="" disabled>Výběr...</option>
                  <option value="1.Ai">1.Ai</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>Nadpis</label>
              <input type="text" className="text-input" />
            </div>

            <div className="form-group full-width grow">
              <label>Zpráva</label>
              <textarea className="text-area"></textarea>
            </div>

            <footer className="card-footer">
              <button className="btn-send">Odeslat</button>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}