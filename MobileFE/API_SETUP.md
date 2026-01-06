# API Setup Guide

## Jak se přihlásit

### 1. Spusťte backend server
Nejprve se ujistěte, že backend server běží. V repozitáři [clone-skolaonline](https://github.com/rbrdlik/clone-skolaonline) spusťte backend server podle instrukcí v README.

### 2. Zkontrolujte API URL
Upravte API URL v souboru `app/config/api.js`:
   - Pro iOS simulátor: `http://localhost:3000/api`
   - Pro Android emulátor: `http://10.0.2.2:3000/api`
   - Pro fyzické zařízení: `http://YOUR_IP_ADDRESS:3000/api` (nahraďte YOUR_IP_ADDRESS vaší lokální IP adresou)

### 3. Přihlašovací údaje
Použijte přihlašovací údaje vytvořené v backendu. Pokud backend ještě nemá vytvořené uživatele, musíte je nejdříve vytvořit přes webovou aplikaci nebo přímo v databázi.

**Příklad přihlašovacích údajů:**
- Uživatelské jméno: `student1` (nebo jakékoliv jméno vytvořené v backendu)
- Heslo: `password123` (nebo jakékoliv heslo nastavené v backendu)

### 4. Testování bez backendu
Pokud chcete testovat UI bez backendu, aplikace automaticky použije mock data pro rozvrh, ale přihlášení vyžaduje funkční backend.

## Struktura API endpointů

Aplikace očekává následující API endpointy:

### Autentizace
- `POST /api/auth/login` - Přihlášení
  - Body: `{ username: string, password: string }`
  - Response: `{ token: string, user: { id, username, studentId, ... } }`

- `GET /api/auth/me` - Získání aktuálního uživatele
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ id, username, studentId, ... }`

### Rozvrh
- `GET /api/timetable/:studentId?week=YYYY-MM-DD` - Získání rozvrhu
  - Response: `{ days: [...], lessons: [...] }`

### Známky
- `GET /api/grades/:studentId?semester=1` - Získání známek
  - Response: `{ grades: [...] }`

### Zprávy
- `GET /api/messages/:studentId` - Získání zpráv
  - Response: `{ messages: [...] }`

### Třída
- `GET /api/class/:classId` - Informace o třídě
  - Response: `{ class: {...}, students: [...] }`

## Testování bez backendu

Aplikace má fallback na mock data, takže můžete testovat UI i bez připojeného backendu. Mock data jsou v:
- `app/data/timetable.js`

## Poznámky

- Token se automaticky ukládá do AsyncStorage po úspěšném přihlášení
- Token se automaticky přidává do všech API požadavků
- Pokud API volání selže, aplikace použije mock data jako fallback

