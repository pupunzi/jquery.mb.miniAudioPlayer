<?php
/**
 * Download the mp3 file.
 */
$file_name = $_GET["filename"];
$file_url = $_GET["fileurl"];
$filename = basename ($file_url) ;
$filesize = filesize($dir_name);
$file_extension = strtolower (substr (strrchr ($filename, '.'), 1)) ;

//This will set the Content-Type to the appropriate setting for the file
switch ($file_extension)
{
    case 'kmz':
        $content_type = 'application/vnd.google-earth.kmz' ;
        break ;
    case 'kml':
        $content_type = 'application/vnd.google-earth.kml+xml' ;
        break ;
    case 'pdf':
        $content_type = 'application/pdf' ;
        break ;
    case 'exe':
        $content_type = 'application/octet-stream' ;
        break ;
    case 'zip':
        $content_type = 'application/zip' ;
        break ;
    case 'doc':
        $content_type = 'application/msword' ;
        break ;
    case 'xls':
        $content_type = 'application/vnd.ms-excel' ;
        break ;
    case 'ppt':
        $content_type = 'application/vnd.ms-powerpoint' ;
        break ;
    case 'gif':
        $content_type = 'image/gif' ;
        break ;
    case 'png':
        $content_type = 'image/png' ;
        break ;
    case 'jpeg':
    case 'jpg':
        $content_type = 'image/jpg' ;
        break ;
    case 'mp3':
        $content_type = 'audio/mpeg' ;
        break ;
    case 'mp4a':
        $content_type = 'audio/mp4' ;
        break ;
    case 'wav':
        $content_type = 'audio/x-wav' ;
        break ;
    case 'mpeg':
    case 'mpg':
    case 'mpe':
        $content_type = 'video/mpeg' ;
        break ;
    case 'mov':
        $content_type = 'video/quicktime' ;
        break ;
    case 'avi':
        $content_type = 'video/x-msvideo' ;
        break ;

    //The following are for extensions that shouldn't be downloaded (sensitive stuff, like php files)
    case 'php':
    case 'htm':
    case 'html':
    case 'txt':
        die ('<b>Cannot be used for '. $file_extension .' files!</b>') ;
        break;
    default:
        $content_type = 'application/force-download' ;
}

//die($file_extension ."   ". $content_type ."   ". $file_name ."   ". $file_url."   ". ini_get('allow_url_fopen'));

/*ob_clean();
flush();*/

header ('Pragma: public') ;
header ('Expires: 0') ;
header ('Cache-Control: must-revalidate, post-check=0, pre-check=0') ;
header ('Cache-Control: private') ;
header ('Content-Type: ' . $content_type);
header("Content-Description: File Transfer");
header("Content-Transfer-Encoding: Binary");
header("Content-disposition: attachment; filename=\"".$filename."\"");
//header('Content-Length: '.$filesize+1);
header('Connection: close');

if($fp=@fopen($file_url,'rb')){

    $fp=@fopen($file_url,'rb');
    // send the file content
    fpassthru($fp);
    // close the file
    fclose($fp);

}else{
    // readfile($file_url);

    $path = "tmp/file.mp3";
    $fp = fopen($path, 'w');

    $ch = curl_init($file_url);
    curl_setopt ($ch, CURLOPT_URL, $file_url);
    //curl_setopt ($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FILE, $fp);
    $contents = curl_exec($ch);
    curl_close($ch);
    fclose($fp);

// display file
    echo $contents;
}

exit;
