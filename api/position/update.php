<?php
require_once('common.inc');

$position = $_POST['position'];
if (!isset($position['screen_name'])) {
    $position['screen_name'] = '';
}

$ip_address = $_SERVER['REMOTE_ADDR'];
$res = $db->extended->autoExecute(
    'position', null, MDB2_AUTOQUERY_SELECT,
    'ip_address = '.$db->quote( $ip_address)
);
PEAR::isError($res) && die($res->getMessage());

// UPDATE
$rows = array();
if ($row = $res->fetchRow()) {
    $rows[] = $row;
}

foreach ($rows as $row) {
    $res = $db->extended->autoExecute(
        'position',
        array(
            'lat' => $position['lat'],
            'lng' => $position['lng'],
            'screen_name' => $position['screen_name']
        ),
        MDB2_AUTOQUERY_UPDATE,
        'ip_address = '.$db->quote( $ip_address)
    );
    PEAR::isError($res) && die($res->getMessage());
}

// INSERT
if (!isset($row)) {
    $rows = $db->extended->autoExecute(
        'position',
        array(
            'ip_address' => $ip_address,
            'lat' => $position['lat'],
            'lng' => $position['lng'],
            'screen_name' => $position['screen_name']
        ),
        MDB2_AUTOQUERY_INSERT
    );
    PEAR::isError($rows) && die($rows->getMessage());
}

header('HTTP/1.1 200 OK');
header('Content-Type: application/json;charset=UTF-8');
header("Access-Control-Allow-Origin: *");

$json = array(
    'success' => array()
);

echo json_encode($json);
