# Spreadsheet column mapping

Use tolerant header matching.

Preferred canonical fields:
- service_date
- rsad
- client
- location
- service

Common header variants:
- service_date: Data, Data do Serviço, Data Serviço, Date
- rsad: RSAD, NServiço, N Serviço, NServico, Service ID
- client: Cliente, CLI_Nome, Client
- location: Morada, Local, LocalDesc, Morada / Local
- service: Serviço a realizar, Serviço a executar, EventTypeDesc, Serviço

Rules:
- Preserve client and service text exactly from the spreadsheet when available.
- Do not rewrite or simplify critical fields unless the user explicitly asks.
- If a critical field is missing, mark the row as excluded and state the reason.
