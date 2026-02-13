## Where AI Was Used ##

AI tools were used to assist in:

UI layout inspiration (via Lovable)

Improving Tailwind styling consistency

Drafting the LLM system prompt

Designing clean service-layer abstraction for LLM providers

Improving error handling patterns (backend + frontend)

All AI-generated suggestions were reviewed, modified, and integrated manually. The final architecture and production decisions were made intentionally to ensure scalability and correctness.

## AI Tools Used ##
1.` Lovable`

- Used primarily for:

- UI prototyping

- Rapid frontend layout generation

- Tailwind styling refinements

- Component-level design improvements

- Lovable helped accelerate visual scaffolding, but logic, state handling, and API integration were manually implemented and refined.


2. `LLM Provider: Google Gemini`

- Purpose: Extract structured action items from transcripts.

- Gemini was used because:

- Strong structured-output capability

- Good instruction-following behavior

- Cost-effective for transcript processing

- Fast response latency

- The project uses a provider abstraction layer to allow future expansion to other LLMs (e.g., OpenAI)

## Prompt Engineering Strategy ##

- The system prompt enforces strict rules:

- Output must be valid JSON only

- No markdown or commentary

- Only explicit task assignments

- No inferred owners

- No hallucinated due dates

- YYYY-MM-DD formatting for dates

- Null for missing owner/dueDate

- Multiple examples included for consistency

- The prompt prioritizes correctness over aggressive extraction.

## LLM Output Safety Measures ##

- Raw LLM response is parsed via JSON.parse

- Output is validated using Zod schema

- Invalid responses are rejected

- Errors are handled via centralized middleware

## What Was Built Without AI Assistance ##

- Express routing

- Validation middleware

- Custom ApiError class

- Centralized error handling

- LLM provider abstraction

- Zod schema validation

- Frontend API error handling

- Transcript history handling

- State management logic

- Folder architecture decisions

## Limitations ##

Relative deadlines may not resolve without explicit current date

No retry mechanism for malformed LLM JSON

No confidence score for extracted tasks

No semantic duplicate detection

## Future Improvements ##
Multi-provider LLM support

Retry + fallback parsing strategy

Confidence scoring

Fine-tuned prompt optimization

Deployment-ready logging & monitoring

Authentication layer

