<?php

	########################################################################

	$GLOBALS['cfg']['api']['methods'] = array_merge(array(

		"dogeared.documents.getInfo" => array(
			"description" => "Return the text for a document",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_documents",
			"requires_perms" => 1,
			"parameters" => array(
				array(
					"name" => "document_id",
					"description" => "",
					"required" => 1,
				),
			),
		),

		"dogeared.highlights.addHighlight" => array(
			"description" => "Add a highlight for a document",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_highlights",
			"requires_perms" => 2,
			"requires_method" => "POST",
			"parameters" => array(
				array(
					"name" => "document_id",
					"description" => "",
					"required" => 1,
				),
				array(
					"name" => "text",
					"description" => "",
					"required" => 1,
				),
			),
		),

		"dogeared.readinglists.addDocument" => array(
			"description" => "Add a document to a user's reading list",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_readinglists",
			"requires_perms" => 2,
			"requires_method" => "POST",
		),

		"dogeared.readinglists.getDocuments" => array(
			"description" => "Return the list of documents in a user's reading list",
			"documented" => 1,
			"enabled" => 1,
			"library" => "api_dogeared_readinglists",
			"requires_perms" => 1,
		),

	), $GLOBALS['cfg']['api']['methods']);

	########################################################################

	# the end
