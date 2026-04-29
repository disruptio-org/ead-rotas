# Timeframe examples

This skill should understand timeframe requests in Portuguese or English.

Supported examples:
- planear amanhã
- planeia amanhã
- plan tomorrow
- planear hoje
- planear a próxima semana
- plan next week
- planear a semana de 29/06/2026
- plan the week of 2026-06-29
- planear 23/04/2026
- plan 23 April 2026
- planear de 23 a 27 de abril
- plan 23 to 27 April
- planear segunda a terça
- plan Monday to Tuesday
- planear o próximo mês
- plan next month

Interpretation rules:
- If the request is ambiguous, inspect the spreadsheet date range first and choose the nearest matching future period that exists in the file.
- If the requested period is not present in the file, stop and explain that no rows were found for that period.
- Keep the user's language in the response and outputs when practical.
