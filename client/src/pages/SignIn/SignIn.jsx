import "../../scss/SignIn.scss";
import logo from "../../assets/icons/logo.png";

export default function SignIn() {
  return (
    <>
      <div className="signin-bg">
        <div className="signin-card">
          <div className="signin-logo">
            <img src={logo} alt="MojeŠkola" />
          </div>

          <div className="signin-inputs">
            <div className="input-icon">
              <svg viewBox="0 0 640 640" aria-hidden="true">
                <path d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z" />
              </svg>
              <input type="text" placeholder="Zadejte přihlašovací jméno…" />
            </div>

            <div className="input-icon">
              <svg viewBox="0 0 640 640" aria-hidden="true">
                <path d="M400 416C497.2 416 576 337.2 576 240C576 142.8 497.2 64 400 64C302.8 64 224 142.8 224 240C224 258.7 226.9 276.8 232.3 293.7L71 455C66.5 459.5 64 465.6 64 472L64 552C64 565.3 74.7 576 88 576L168 576C181.3 576 192 565.3 192 552L192 512L232 512C245.3 512 256 501.3 256 488L256 448L296 448C302.4 448 308.5 445.5 313 441L346.3 407.7C363.2 413.1 381.3 416 400 416zM440 160C462.1 160 480 177.9 480 200C480 222.1 462.1 240 440 240C417.9 240 400 222.1 400 200C400 177.9 417.9 160 440 160z" />
              </svg>
              <input type="password" placeholder="Zadejte heslo…" />
            </div>
          </div>

          <button className="signin-button">Přihlásit se</button>
        </div>
      </div>
    </>
  );
}
