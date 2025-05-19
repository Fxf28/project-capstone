CREATE TABLE "todo" (
	"id" integer PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"done" boolean DEFAULT false NOT NULL
);

DROP TABLE "posts_table";
DROP TABLE "users_table";