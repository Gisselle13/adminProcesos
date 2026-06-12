-- ============================================================
-- Script: Crear tabla recibeoc_backup
-- Descripción: Respaldo automático de registros eliminados
--              de la tabla recibeoc
-- ============================================================

CREATE TABLE IF NOT EXISTS `recibeoc_backup` (
  `id`                INT(11) NOT NULL AUTO_INCREMENT,
  `id_original`       INT(11) NOT NULL COMMENT 'ID original en recibeoc',
  `folio`             INT(11),
  `cantidad`          DOUBLE,
  `frecibida`         DATE,
  `hrecibida`         TIME,
  `renglon`           SMALLINT(6),
  `factura`           CHAR(11),
  `observacion`       CHAR(100),
  `nosemana`          DOUBLE,
  `umedida`           CHAR(10),
  `precio`            FLOAT(10,5),
  `claveg`            CHAR(2),
  `claves`            SMALLINT(6),
  `clavedp`           CHAR(2),
  `clavec`            CHAR(4),
  `clavepro`          INT(11),
  `material`          CHAR(80),
  `provedor`          CHAR(50),
  `usuario`           VARCHAR(100),
  `horaini`           TIME,
  `horafin`           TIME,
  `fechafac`          DATE,
  `estatus`           SMALLINT(6),
  -- Campos de auditoría del backup
  `fecha_eliminacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `eliminado_por`     VARCHAR(100) DEFAULT 'sistema',
  PRIMARY KEY (`id`),
  INDEX `idx_id_original` (`id_original`),
  INDEX `idx_folio` (`folio`),
  INDEX `idx_fecha_eliminacion` (`fecha_eliminacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
  COMMENT='Respaldo de registros eliminados de recibeoc';
