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

Příklad:

```bash
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-with-a-long-random-secret"
```

Pro vygenerování bezpečného `JWT_SECRET` můžete použít například:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

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

- `JWT_SECRET` musí být nastavený, jinak selžou operace pracující se session cookie.
- Pokud došlo k úniku tajného klíče, je potřeba ho okamžitě vyměnit.
- Pro nasazení je vhodné pravidelně zálohovat databázi a uchovávat migrace spolu se seed skriptem.
- Repo záměrně verzuje minimální soubory v `.next/types/`, aby `npx tsc --noEmit` fungovalo i v čistém checkoutu před prvním `next build`.
- Po přidání nebo přejmenování rout je potřeba tyto `.next/types/*` soubory obnovit přes `npm run build`, aby zůstaly v souladu s aktuální strukturou aplikace.

## GitHub CI

- Automatická kontrola je definovaná v [.github/workflows/ci.yml](/home/oliver/Documents/ateneo-web/.github/workflows/ci.yml).
- Workflow při pushi a pull requestu spouští `npm test`, `npm run lint`, `npx tsc --noEmit`, `npx prisma validate`, `npx prisma generate` a `npm run build`.
- Na GitHubu je potřeba mít zapnuté GitHub Actions pro tento repozitář.

## Testovací preview přes GitHub

- Plná aplikace neběží na GitHub Pages, protože používá server actions, cookies a Prisma.
- Pro dočasné testování s několika lidmi je připravená konfigurace Codespaces v [.devcontainer/devcontainer.json](/home/oliver/Documents/ateneo-web/.devcontainer/devcontainer.json).
- Po vytvoření Codespace spusťte `npm run dev`, otevřete port `3000` a sdílejte URL jen s lidmi, kterým chcete preview ukázat.
