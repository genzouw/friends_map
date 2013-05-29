create database gps
    default character set utf8;

grant
    create,
    insert,
    update,
    delete,
    select,
    alter
    on gps.*
    to gps@localhost
    identified by 'gps';


flush privileges;


CREATE TABLE position (
    ip_address varchar(15) not null,
    lat text,
    lng text,
    screen_name text,
    update_date timestamp,
    primary key (ip_address)
);

alter table position add column screen_name text;
alter table position add column update_date timestamp;
