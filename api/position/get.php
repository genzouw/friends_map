<?php
require_once('common.inc');

$ip_address = $_SERVER['REMOTE_ADDR'];

header('HTTP/1.1 200 OK');
header('Content-Type: application/json;charset=UTF-8');
header("Access-Control-Allow-Origin: *");

$res = $db->extended->autoExecute(
    'position', null, MDB2_AUTOQUERY_SELECT,
    'ip_address != '.$db->quote( $ip_address)
);
PEAR::isError($res) && die($res->getMessage());


$json = array(
    'success' => array(
        'positions' => array_map(
            function ( $it ) use ( $ip_address ) {
                $row = (array) $it;
                $row['screen_name'] = $row['screen_name'] ?: '名無し';
                $row['other'] = ( $row['ip_address'] != $ip_address );
                return $row;
            }
            ,$res->fetchAll()
        )
    )
);


echo json_encode($json);
