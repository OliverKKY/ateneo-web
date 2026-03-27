# Ateneo Web

Interní webová aplikace pro správu sborových uživatelů, událostí a archivu skladeb. Projekt běží na `Next.js`, používá `Prisma` se SQLite a autentizaci přes podepsanou session cookie.

## Lokální spuštění

1. Nainstalujte závislosti:

```bash
npm install
```

2. Vytvořte `.env` podle `.env.example`.

Požadované proměnné:

- `DATABASE_URL`
- `JWT_SECRET`

3. Aplikujte migrace a naplňte základní data:

```bash
npx prisma migrate dev
npx prisma db seed
```

4. Spusťte vývojový server:

```bash
npm run dev
```

Výchozí seed vytvoří administrátora:

- Email: `admin@ateneo.cz`
- Heslo: `admin123`

## Role a oprávnění

- `Administrátor` spravuje uživatele, skladby i události.
- `Notář` a `Sbormistr` mohou vytvářet skladby; mazání skladeb je omezené na administrátora a notáře.
- `Manažer` a `Předseda` mohou vytvářet události.
- Běžní členové se mohou přihlašovat na události v otevřeném přihlašovacím okně.

## Prisma workflow

- Schéma je v [prisma/schema.prisma](/home/oliver/Documents/ateneo-web/prisma/schema.prisma).
- Seed skript je v [prisma/seed.ts](/home/oliver/Documents/ateneo-web/prisma/seed.ts).
- Lokální databázové soubory `prisma/*.db` nemají být verzované.

## Provozní poznámky

- `JWT_SECRET` musí být nastavený, jinak aplikace failne při startu.
- Pokud došlo k úniku tajného klíče, je potřeba ho okamžitě vyměnit.
- Pro nasazení je vhodné pravidelně zálohovat databázi a uchovávat migrace spolu se seed skriptem.
