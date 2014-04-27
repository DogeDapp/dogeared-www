<?php
	include('include/init.php');

	loadlib("dogeared_extruder");
	loadlib("dogeared_documents");
	loadlib("dogeared_readinglists");

	loadlib("urls_normalize");

	if (! login_check_login()){
		$url = "{$GLOBALS['cfg']['abs_root_url']}signin/";

		header("location: {$url}");
		exit();
	}

	# sudo put me in an API methods or something

	/*

	if ($url = post_str("url")){

		$document = dogeared_documents_get_by_url($url);

		if (! $document){

			$service = (preg_match("/\.pdf$/", $url)) ? "tika" : "boilerpipe";
			$rsp = dogeared_extruder($url, $service);

			$service_map = dogeared_extruder_services_map('string keys');
			$service_id = $service_map[ $service ];

			$blocks = $rsp['data']['document']['blocks'];
			$blocks = json_encode($blocks);

			$document = array(
				'url' => $url,
				'service_id' => $service_id,
				'document' => $blocks,
			);

			$rsp = dogeared_documents_add_document($document);
			$document = $rsp['document'];
		}

		$user = $GLOBALS['cfg']['user'];

		$rsp = dogeared_readinglists_add_document($user, $document);
		dumper($rsp);
	}

	*/

	$GLOBALS['smarty']->display('page_index.txt');
	exit();

?>
