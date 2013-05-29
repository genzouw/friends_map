<?php
date_default_timezone_set('Asia/Tokyo');

$debug = true;
//$debug = false;

$database = "gps";
$user_name = "gps";
$host     = "127.0.0.1";
$password = "gps";
$charset  = 'utf8';

require_once 'MDB2.php';

$db = MDB2::connect("mysql://$user_name:$password@$host/$database?charset={$charset}");
if (MDB2::isError($db))
    die($db->getMessage());

$db->loadModule('Extended');

$db->setFetchMode(MDB2_FETCHMODE_OBJECT);
