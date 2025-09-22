-- Limpar blob URLs inválidos na tabela people
UPDATE people 
SET avatar = NULL 
WHERE avatar LIKE 'blob:%';

-- Verificar quais registros foram afetados
SELECT name, avatar FROM people WHERE name = 'Gilberto';