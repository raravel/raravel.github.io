/*
 * meta-data.js
 * Created on Tue Aug 04 2020
 *
 * Copyright (c) Tree Some. Licensed under the MIT License.
 */

const path = require('path');
const fs = require('fs');

const MHexo = require('hexo');
const mhexo = new MHexo(process.cwd(), {});

const db = [];

mhexo.init()
	.then(() => mhexo.load())
	.then(() => {
		const sourceDir = mhexo.config.source_dir;
		const query = mhexo.locals.get('posts');
		for ( let i=0; i < query.length;i++ ) {
			const post = query.data[i];
			const utc = post.updated.utc().format();

			db.push({
				title: post.title,
				href: post.path,
				updated: utc,
				src: path.join(sourceDir, post.source),
				categories: post.categories.data.map(c => c.name),
				tags: post.tags.data.map(t => t.name),
				cover: post.cover,
				content: post.content,
			});
		}

		fs.writeFileSync(
			path.join(process.cwd(), 'meta-data.json'),
			JSON.stringify(db, null, '\t'),
			{ encoding: 'utf8' }
		);
		mhexo.exit();
		process.exit(0);
	});

