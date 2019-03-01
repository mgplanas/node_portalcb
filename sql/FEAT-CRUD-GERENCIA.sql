ALTER TABLE portaldb.gerencia
 CHANGE id_gerencia id INT(11) AUTO_INCREMENT NOT NULL,
 ADD created DATETIME AFTER sigla,
 ADD createdBy INT,
 ADD modified DATETIME,
 ADD modifiedBy INT,
 ADD deleted DATETIME,
 ADD deletedBy INT;
