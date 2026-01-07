# Development Mode - Přeskočení přihlášení

## Automatické mock přihlášení

V development módu (`__DEV__ = true`) aplikace automaticky:

1. **Při startu** - Pokud není uložený token, automaticky přihlásí mock uživatele
2. **Při chybě backendu** - Pokud backend není dostupný, použije mock uživatele místo chyby
3. **Tlačítko "Přeskočit přihlášení"** - Zobrazí se na přihlašovací obrazovce v dev módu

## Mock uživatel

```javascript
{
  id: 'dev-user-1',
  username: 'teststudent',
  studentId: 'student-1',
  name: 'Test Student',
  class: '1A1',
}
```

## Jak to funguje

- **Automaticky**: Při startu aplikace se automaticky přihlásí mock uživatel
- **Manuálně**: Můžete kliknout na tlačítko "⚡ Přeskočit přihlášení (Dev Mode)" na přihlašovací obrazovce
- **Fallback**: Pokud se pokusíte přihlásit a backend není dostupný, automaticky se použije mock přihlášení

## Vypnutí dev módu

Pokud chcete testovat s reálným backendem:

1. Spusťte backend server
2. Nastavte správnou API URL v `app/config/api.js`
3. Použijte reálné přihlašovací údaje

Mock přihlášení se použije pouze pokud:
- Backend není dostupný (chyba při připojení)
- Nebo použijete username "dev" nebo "test"

## Poznámka

Tato funkce je dostupná pouze v development módu. V production buildu se mock přihlášení nepoužije.


