## FEAT-USAURIOS-FIX
**Fecha :** 2019-03-06
### Listado de caractarísticas
- Se agregan los campos faltantes de los usuarios
    - cargo
    - gerencia
    - grupo
    - contacto
- Se agrega la relación de gerencia a los grupos
- Se arreglan las API
    - POST, PUT y GET (lookup)


## FEAT-AUDIT-FIELDS
**Fecha :** 2019-03-01
### Listado de caractarísticas
- Arreglo de crud en la actualización de los campos de auditoria


## FEAT-CRUD-GERENCIAS
**Fecha :** 2019-02-28
### Listado de caractarísticas
- Se cambia app.METHOD por el uso de express.Router
- Se generan las rutas para la administración de gerencias 
- Se generan las rutas para la administración de grupos
- Se adecúan las tablas para tener los datos de auditoría estandart
    - Se agregan campos de auditoria (created, createdBy, modified, modifiedBy, deleted, deletedBy) en Gerencia y grupo
- Version MongoDB
- Busqueda y paginado


```
[GET]/genencias?desde&limite
[GET]/genencias/buscar/:termino
[PUT]/genencias/:id
[DELETE]/genencias/:id
[POST]/genencias/

[GET]/grupos?desde&limite
[GET]/grupos/buscar/:termino
[PUT]/grupos/:id
[DELETE]/grupos/:id
[POST]/grupos/

[GET]/usuarios?desde&limite
[GET]/usuarios/buscar/:termino
[PUT]/usuarios/:id
[DELETE]/usuarios/:id
[POST]/usuarios/

```