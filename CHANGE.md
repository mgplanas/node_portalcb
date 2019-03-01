## FEAT-CRUD-GERENCIAS
** Fecha :** 2019-02-28
### Listado de caractarísticas
- Se cambia app.METHOD por el uso de express.Router
- Se generan las rutas para la administración de gerencias 
- Se generan las rutas para la administración de grupos
- Se adecúan las tablas para tener los datos de auditoría estandart
    - Se cambia id_gerencia por id
    - Se cambia id_grupo por id
    - Se agregan campos de auditoria (created, createdBy, modified, modifiedBy, deleted, deletedBy) en Gerencia y grupo


```
[GET]\genencia
[PUT]\genencia\:id
[DELETE]\genencia\:id
[POST]\genencia\

```