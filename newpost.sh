#!/bin/bash

date=$(date +%Y-%m-%d)
title=
author=

function input {
	echo "Enter post title:"
	read title
	echo "Enter author name:"
	read author
}

function confirmation {
	echo "Is the following correct?"
	echo "title: $title"
	echo "author: $author"
	echo "y/n"
}

function main {
	local conf="n"
	while [ "$conf" != "y" ]
	do
		input
		confirmation
		read conf
	done
	postname="./site/posts/$date-${title// /-}.md"
	echo -e "---\ntitle: ${title}\nauthor: ${author}\ndescription: \n---" >> $postname
	${VISUAL:-vim} $postname
}

main

unset date title author
