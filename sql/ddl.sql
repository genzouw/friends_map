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


create table positions (
    id int not null auto_incremennt primary key,
    group_id int,
    ip_address varchar(15) not null,
    lat text,
    lng text,
    screen_name text,
    created datetime default null,
    modified datetime default null
);

create unique index uq_position_id_address
    on position (id_address)
;

create index idx_position_group_id
    on position (group_id)
;

alter table position add column screen_name text;
alter table position add column update_date timestamp;


