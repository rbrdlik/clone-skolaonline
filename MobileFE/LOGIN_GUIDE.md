# 📱 Průvodce přihlášením

## Jak se přihlásit do aplikace

### Krok 1: Spusťte backend server

Nejprve musíte mít spuštěný backend server z repozitáře [clone-skolaonline](https://github.com/rbrdlik/clone-skolaonline).

1. Přejděte do složky se serverem
2. Spusťte server (obvykle `npm start` nebo `node server.js`)
3. Ujistěte se, že server běží na portu 3000 (nebo upravte port v konfiguraci)

### Krok 2: Nastavte API URL

Otevřete soubor `app/config/api.js` a upravte `BASE_URL` podle vašeho prostředí:

```javascript
BASE_URL: __DEV__ 
  ? 'http://localhost:3000/api' // Pro iOS simulátor
  // ? 'http://10.0.2.2:3000/api' // Pro Android emulátor - odkomentujte tento řádek
  // ? 'http://192.168.1.XXX:3000/api' // Pro fyzické zařízení - nahraďte XXX vaší IP
  : 'https://your-api-domain.com/api'
```

**Důležité:**
- Pro **Android emulátor** použijte `http://10.0.2.2:3000/api`
- Pro **fyzické zařízení** použijte IP adresu vašeho počítače (např. `http://192.168.1.100:3000/api`)
- Zjistěte IP adresu: Windows (`ipconfig`), Mac/Linux (`ifconfig`)

### Krok 3: Vytvořte uživatelský účet

Pokud ještě nemáte uživatelský účet v backendu, musíte ho vytvořit:

1. **Přes webovou aplikaci** (pokud je dostupná)
2. **Přímo v databázi** MongoDB
3. **Přes API endpoint** pro registraci (pokud existuje)

### Krok 4: Přihlaste se

1. Spusťte mobilní aplikaci (`npm start` v MobileFE složce)
2. Zobrazí se přihlašovací obrazovka
3. Zadejte:
   - **Uživatelské jméno**: vaše uživatelské jméno z backendu
   - **Heslo**: vaše heslo z backendu
4. Klikněte na "Přihlásit se"

### Řešení problémů

#### "Chyba připojení k serveru"
- ✅ Zkontrolujte, že backend server běží
- ✅ Zkontrolujte API URL v `app/config/api.js`
- ✅ Zkontrolujte, že port 3000 není blokovaný firewallem
- ✅ Pro fyzické zařízení: ujistěte se, že telefon a počítač jsou na stejné WiFi síti

#### "Nesprávné přihlašovací údaje"
- ✅ Zkontrolujte, že uživatelský účet existuje v databázi
- ✅ Ověřte správnost uživatelského jména a hesla
- ✅ Zkontrolujte, že backend správně ověřuje přihlašovací údaje

#### "API request failed"
- ✅ Zkontrolujte konzoli backendu pro chyby
- ✅ Zkontrolujte, že endpoint `/api/auth/login` existuje a funguje
- ✅ Ověřte, že backend vrací správný formát odpovědi: `{ token: "...", user: {...} }`

### Testovací účet

Pokud chcete rychle otestovat aplikaci, můžete vytvořit testovací účet přímo v MongoDB:

```javascript
// V MongoDB shell nebo přes backend
db.users.insertOne({
  username: "test",
  password: "$2b$10$..." // bcrypt hash hesla "test123"
  // ... další pole
})
```

**Poznámka:** Heslo musí být zahashované pomocí bcrypt.

### Kontrola připojení

Pro ověření, že aplikace může komunikovat s backendem:

1. Otevřete konzoli v aplikaci (React Native Debugger nebo Chrome DevTools)
2. Zkontrolujte, zda se zobrazují chyby při přihlášení
3. Zkontrolujte network tab, zda se odesílají požadavky na správnou URL

---

**Potřebujete pomoc?** Zkontrolujte:
- Backend logy pro chyby
- Konzoli mobilní aplikace
- Network requests v DevTools

