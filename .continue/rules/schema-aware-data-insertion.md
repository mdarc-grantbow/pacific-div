---
globs: "**/*.ts, **/*.zod", "**/*.tsx"
description: This rule enforces strict adherence to the Drizzle schema during
  data insertion, minimizing the risk of runtime errors and data
  inconsistencies.  It emphasizes the importance of data validation and type
  safety within the database operations.
alwaysApply: true
---

Before inserting data into any Drizzle ORM table, meticulously review the corresponding schema definition to identify all required fields and their expected data types. Validate that the provided data accurately matches the schema's specifications to prevent type errors and ensure data integrity.