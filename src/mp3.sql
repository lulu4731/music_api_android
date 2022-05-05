//F6 lưu dữ liệu

CREATE TABLE account(
	id_account serial PRIMARY KEY,
	email varchar(50) UNIQUE,
	account_name varchar(50) UNIQUE,
	avatar text default '',
	password text NOT NULL,
	create_date date default CURRENT_DATE,
	role smallint default 0,
	account_status smallint default 0
);

insert into account(email, account_name, password) values ('vinhvipit@gmail.com', 'Quang Vinh', '123456');

CREATE TABLE album(
	id_album serial PRIMARY KEY,
	name_album varchar(50) UNIQUE,
	create_date date default CURRENT_DATE
);

CREATE TABLE song(
	id_song serial PRIMARY KEY,
	name_song varchar(50) UNIQUE,
	link text default '/public/',
	lyrics text,
	description text,
	created timestamp without time zone default timezone('Asia/Ho_Chi_Minh'::text, now()),
	id_account serial NOT NULL,
	id_album serial,
	song_status smallint default 0,
	listen integer default 0,

	FOREIGN KEY (id_account) REFERENCES account(id_account),
	FOREIGN KEY (id_album) REFERENCES album(id_album)
);

CREATE TABLE love(
	id_account serial,
	id_song serial,
	love_time timestamp without time zone default timezone('Asia/Ho_Chi_Minh'::text, now()),
	
	PRIMARY KEY(id_account, id_song),

	FOREIGN KEY (id_account) REFERENCES account(id_account),
	FOREIGN KEY (id_song) REFERENCES song(id_song)
);

CREATE TABLE singer_song(
	id_account serial,
	id_song serial,
	
	PRIMARY KEY(id_account, id_song),

	FOREIGN KEY (id_account) REFERENCES account(id_account),
	FOREIGN KEY (id_song) REFERENCES song(id_song)
);

CREATE TABLE comment(
	id_cmt serial PRIMARY KEY,
	id_account serial NOT NULL,
	id_song serial NOT NULL,
	content text NOT NULL,
	date_time timestamp without time zone default timezone('Asia/Ho_Chi_Minh'::text, now()) NOT NULL,
	id_cmt_parent integer default 0,

	FOREIGN KEY (id_account) REFERENCES account(id_account),
	FOREIGN KEY (id_song) REFERENCES song(id_song)
);

CREATE TABLE notification(
	id_notification serial PRIMARY KEY,
	content text NOT NULL,
	action text,
	notification_status smallint default 0,
	notification_time timestamp without time zone default timezone('Asia/Ho_Chi_Minh'::text, now())
);

CREATE TABLE type(
	id_type serial PRIMARY KEY,
	name_type varchar(50) UNIQUE,
	description text
);

CREATE TABLE song_type(
	id_song serial,
	id_type serial,

	PRIMARY KEY(id_song, id_type),

	FOREIGN KEY (id_song) REFERENCES song(id_song),
	FOREIGN KEY (id_type) REFERENCES type(id_type)
);

CREATE TABLE playlist(
	id_playlist serial PRIMARY KEY,
	name_playlist varchar(50) UNIQUE,
	id_account serial NOT NULL,
	playlist_status smallint default 0,

	FOREIGN KEY (id_account) REFERENCES account(id_account)
);

CREATE TABLE song_type(
	id_playlist serial,
	id_song serial NOT NULL,
	playlist_song_time timestamp without time zone default timezone('Asia/Ho_Chi_Minh'::text, now()),

	PRIMARY KEY(id_playlist, id_song),

	FOREIGN KEY (id_playlist) REFERENCES playlist(id_playlist),
	FOREIGN KEY (id_song) REFERENCES song(id_song) ON DELETE ON DELETE CASCADE
);

CREATE TABLE follow_account(
	id_follower serial,
	id_following serial,
	follow_time timestamp without time zone default timezone('Asia/Ho_Chi_Minh'::text, now()),

	PRIMARY KEY(id_follower, id_following),

	FOREIGN KEY (id_follower) REFERENCES account(id_account),
	FOREIGN KEY (id_following) REFERENCES account(id_account)
);
<<<<<<< HEAD
=======
<<<<<<< HEAD
<<<<<<< HEAD
	
=======
=======
>>>>>>> main/vinh

CREATE TABLE listen (
	id_song serial,
	day date,
	listenOfDay bigint,
	
	PRIMARY KEY(id_song, day),
	
	FOREIGN KEY (id_song) REFERENCES song(id_song),
);
<<<<<<< HEAD
=======
>>>>>>> aca7922d2043c701d1e1ff52788f1294ae144fe9
>>>>>>> main/vinh
	
alter table song_type add FOREIGN KEY (id_song) REFERENCES song(id_song) ON DELETE CASCADE

-- nháp của P
select exists(select 1 from love where love.id_account = $1)

SELECT  song.id_song, song.name_song, song.link, song.listen, count(love.id_song) as qtylove, song.id_account, ss.account_name as singer, song.id_album, song.created, exists(select 1 from love where love.id_account = '1') as lovestatus, st.name_type
FROM ((( song 
LEFT JOIN love ON song.id_song = love.id_song)
INNER JOIN (SELECT * FROM song_type INNER JOIN type ON song_type.id_type = type .id_type) as st ON song.id_song = st.id_song)
LEFT JOIN (SELECT * FROM singer_song INNER JOIN account ON singer_song.id_account = account .id_account) as ss ON song.id_song = ss.id_song)
WHERE song.id_song = 5
GROUP BY song.id_song, st.name_type, st.id_song, ss.account_name
>>>>>>> main/phuc
