const { Pool } = require('pg');
const dotenv = require('dotenv');
const uuid = require('uuid');
const bcrypt = require('bcrypt');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL');
});

/**
 * Create Tables
 */
const createTables = () => {
	
  pool.query(`
create table type_info
(
	id_type_info UUID not null,
	type_info varchar(20),
	active boolean default true not null,
	required boolean default false,
	data_type varchar(50) not null
);

create unique index type_info_id_type_info_uindex
	on type_info (id_type_info);

alter table type_info
	add constraint type_info_pk
		primary key (id_type_info);
		
create table type_check
(
	id_type_check UUID not null,
	type_check varchar(20)
);

create unique index type_check_id_type_check_uindex
	on type_check (id_type_check);

alter table type_check
	add constraint type_check_pk
		primary key (id_type_check);
		
create table employee
(
	id_employee   UUID not null
		constraint employee_pk
			primary key,
	init_date     timestamp default now() not null,
	finish_date   timestamp,
	active        boolean default true  not null,
	username      varchar(50),
	password_hash varchar(150),
	administrator boolean default false
);

alter table employee
	owner to runa_check_time_user;

create unique index employee_id_employee_uindex
	on employee (id_employee);
	
create table employee_info
(
    id_employee  UUID
        constraint employee_info_employee_id_employee_fk
            references employee
            on update cascade on delete cascade,
    id_type_info UUID
        constraint employee_info_type_info_id_type_info_fk
            references type_info
            on update cascade on delete cascade,
    info         varchar(1000),
    init_date    timestamp default now(),
    finish_date  timestamp
);

alter table employee_info
    owner to runa_check_time_user;
	
create table employee_check_time
(
    id_time_clock UUID not null
        constraint employee_check_time_pk
            primary key,
    id_employee   UUID
        constraint employee_check_time_employee_id_employee_fk
            references employee
            on update cascade on delete cascade,
    date          timestamp default now(),
    id_type_check UUID
        constraint employee_check_time_type_check_id_type_check_fk
            references type_check
            on update cascade on delete cascade
);

alter table employee_check_time
    owner to runa_check_time_user;

create unique index employee_check_time_id_time_clock_uindex
    on employee_check_time (id_time_clock);
	`)
    .then((res) => {
      console.log(res);
	  pool.end();
    })
    .catch((err) => {
      console.error(err);
	  pool.end();
    });
}

/**
 * Populate Tables
 */
const populateTables = () => {
	const passAdmin = bcrypt.hashSync("admin", bcrypt.genSaltSync(8));
	const passTesting = bcrypt.hashSync("testing", bcrypt.genSaltSync(8));
  var queryText =
    `
INSERT INTO public.employee (id_employee, init_date, finish_date, active, username, password_hash, administrator) VALUES ('${uuid.v4()}', now(), null, true, 'admin@runahr.com', '${passAdmin}', true);
INSERT INTO public.employee (id_employee, init_date, finish_date, active, username, password_hash, administrator) VALUES ('${uuid.v4()}', now(), null, true, 'testing.employee@runahr.com', '${passTesting}', true);

INSERT INTO public.type_check (id_type_check, type_check) VALUES ('${uuid.v4()}', 'Entrada');
INSERT INTO public.type_check (id_type_check, type_check) VALUES ('${uuid.v4()}', 'Salida');

INSERT INTO public.type_info (id_type_info, type_info, active, required, data_type) VALUES ('${uuid.v4()}', 'Fecha de Nacimiento', true, true, 'date');
INSERT INTO public.type_info (id_type_info, type_info, active, required, data_type) VALUES ('${uuid.v4()}', 'Puesto', true, true, 'text');
INSERT INTO public.type_info (id_type_info, type_info, active, required, data_type) VALUES ('${uuid.v4()}', 'Apellido Materno', true, true, 'text');
INSERT INTO public.type_info (id_type_info, type_info, active, required, data_type) VALUES ('${uuid.v4()}', 'Apellido Paterno', true, true, 'text');
INSERT INTO public.type_info (id_type_info, type_info, active, required, data_type) VALUES ('${uuid.v4()}', 'Nombre', true, true, 'text');
	`;

  pool.query(queryText)
    .then((res) => {
      console.log(res);
      pool.end();
    })
    .catch((err) => {
      console.error(err);
      pool.end();
    });
}

/**
 * Drop Tables
 */
const dropTables = () => {	
  pool.query(`
	DROP TABLE IF EXISTS employee_check_time;
	DROP TABLE IF EXISTS employee_info;
	DROP TABLE IF EXISTS employee;
	DROP TABLE IF EXISTS type_check;
	DROP TABLE IF EXISTS type_info;
  `)
    .then((res) => {
      console.log(res);
	  pool.end();
    })
    .catch((err) => {
      console.error(err);
	  pool.end();
    });
}

pool.on('remove', () => {
  console.log('Client remove from PostgreSQL');
  process.exit(0);
});

module.exports = {
  createTables,
  populateTables,
  dropTables
};

require('make-runnable');