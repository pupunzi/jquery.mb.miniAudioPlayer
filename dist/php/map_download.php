<?php
////////////////////////////////////////////////////////////////////////////////
// jquery.mb.components
//
// file: map_download.php
// last modified: 12/29/17 7:06 PM
// Version:  {{ version }}
// Build:  {{ buildnum }}
//
// Open Lab s.r.l., Florence - Italy
// email:  matteo@open-lab.com
// blog: 	http://pupunzi.open-lab.com
// site: 	http://pupunzi.com
// 	http://open-lab.com
//
// Licences: MIT, GPL
// http://www.opensource.org/licenses/mit-license.php
// http://www.gnu.org/licenses/gpl.html
//
// Copyright (c) 2001-2018. Matteo Bicocchi (Pupunzi)
////////////////////////////////////////////////////////////////////////////////

/**
 * Download file.
 */

if (version_compare(phpversion(), '5.4.0', '<')) {
    if (session_id() == '')
        session_start();
} else {
    if (session_status() == PHP_SESSION_NONE)
        session_start();
}

$file_name = $_GET["filename"];
$file_url = $_GET["fileurl"];
$file_url = str_replace(" ", "%20", $file_url);
$filename = basename($file_url);
$file_path = $file_url;

$file_extension = strtolower(substr(strrchr($filename, '.'), 1));
$web_root = $_SERVER["DOCUMENT_ROOT"];
$web_address = $_SERVER['HTTP_HOST'];

$pos = strrpos($file_url, $web_address);
/**
 * Retrieve the system path of the file
 */
if ($pos) {
    if (isset($_SERVER['HTTPS']) &&
        ($_SERVER['HTTPS'] == 'on' || $_SERVER['HTTPS'] == 1) ||
        isset($_SERVER['HTTP_X_FORWARDED_PROTO']) &&
        $_SERVER['HTTP_X_FORWARDED_PROTO'] == 'https') {
        $protocol = 'https://';
    } else {
        $protocol = 'http://';
    }
    $file_path = str_replace($protocol . $web_address . '/', '', $file_url);
    $file_path = $web_root . "/" . $file_path;
    $file_path = str_replace('//', '/', $file_path);
}

/**
 * Check if there is the cookie that allow the download
 */
if (!isset($_SESSION['maphost']) || $_SESSION['maphost'] != $_SERVER['HTTP_HOST'])
    die ('<b>Something goes wrong, you don\'t have permission to use this page, sorry.</b>');

/*unset($_SESSION['maphost']);
setcookie('maphost', 'false', time() - 3600, '/');*/

//die("protocol= ". $protocol . " ---- web_address= ". $web_address . "  ---- web_root= " . $web_root ." ----- file url= " . $file_url ." ----- file path= " . $file_path . "  ----  file name= " . $file_name . "  ----  maphost= " . $_SESSION['maphost']);

function getFileSize($url)
{
    if (substr($url, 0, 4) == 'http') {
        $x = array_change_key_case(get_headers($url, 1), CASE_LOWER);
        if (strcasecmp($x[0], 'HTTP/1.1 200 OK') != 0) {
            $x = $x['content-length'][1];
        } else {
            $x = $x['content-length'];
        }
    } else {
        $x = @filesize($url);
    }
    return $x;
}

$fileSize = getFileSize($file_url);

function fileExists($path)
{
    return (@fopen($path,"r")==true);
}

if (!file_exists($file_path) || !fileExists($file_path))
    die("<br> The file <b>" . $file_path . "</b> doesn't exist; check the URL");

//This will set the Content-Type to the appropriate setting for the file
switch ($file_extension) {
    case 'mp3':
        $content_type = 'audio/mpeg';
        break;
    case 'mp4a':
        $content_type = 'audio/mp4';
        break;
    case 'm4a':
        $content_type = 'audio/m4a';
        break;
    case 'wav':
        $content_type = 'audio/x-wav';
        break;
    case 'ogg':
        $content_type = 'audio/ogg';
        break;
    default:
        die ('<b>You can\'t access ' . $file_extension . ' files!</b>');
}

/**
 * start stream the file
 */
header('Pragma: public');
header('Expires: 0');
header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
header('Cache-Control: private');
header('Content-Type: ' . $content_type);
header("Content-Description: File Transfer");
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=\"" . $filename . "\"");
header('Content-Length: ' . $fileSize);
header('Connection: close');

if ($fp = @fopen($file_path, 'rb')) {
    //die("fopen");
    sleep(1);
    ignore_user_abort();
    set_time_limit(0);
    while (!feof($fp)) {
        echo(@fread($fp, 1024 * 8));
        ob_flush();
        flush();
    }
    fclose($fp);

} else if (function_exists('curl_version')) {
    //die("curl");
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $file_url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $contents = curl_exec($ch);
    // display file
    echo $contents;
    curl_close($ch);

} else {
    //die("readfile");
    // ob_end_flush();
    ob_clean();
    flush();
    @readfile($file_path);
}

clearstatcache();

exit;
