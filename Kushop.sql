--
-- PostgreSQL database dump
--

\restrict brS8r8Kx8cUANHUlFcCUWtzkhcPbcj2g8Fm2bYSlMFufFiQlIDObGq7YjJgQ0Go

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    "brandId" character varying(50) NOT NULL,
    "brandName" character varying(100)
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- Name: cartDtl; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public."cartDtl" (
    "cartId" character varying(100) NOT NULL,
    "pdId" character varying(100) NOT NULL,
    qty real,
    price real
);


ALTER TABLE public."cartDtl" OWNER TO dev;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.carts (
    "cartId" character varying(100) NOT NULL,
    "cusId" character varying(100),
    "cartDate" date DEFAULT CURRENT_DATE,
    "cartCf" boolean DEFAULT false
);


ALTER TABLE public.carts OWNER TO dev;

--
-- Name: members; Type: TABLE; Schema: public; Owner: dev
--

CREATE TABLE public.members (
    "memEmail" character varying(100) NOT NULL,
    "memName" character varying(100) NOT NULL,
    dutyid character varying(100) DEFAULT 'member'::character varying,
    "memHash" character varying(255) NOT NULL
);


ALTER TABLE public.members OWNER TO dev;

--
-- Name: pdTypes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."pdTypes" (
    "pdTypeId" character varying(50) NOT NULL,
    "pdTypeName" character varying(100)
);


ALTER TABLE public."pdTypes" OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    "pdId" character varying(50) CONSTRAINT "products _pdId_not_null" NOT NULL,
    "pdName" character varying(100),
    "pdPrice" real,
    "pdTypeId" character varying,
    "brandId" character varying,
    "Remark" text,
    "Createdate" timestamp with time zone
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    stdid character varying(50) NOT NULL,
    stdname character varying(100),
    majorid character varying(50)
);


ALTER TABLE public.students OWNER TO postgres;

--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands ("brandId", "brandName") FROM stdin;
B01	Lay's
B02	Pringles
B03	Tasto
B04	Mister Potato
\.


--
-- Data for Name: cartDtl; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public."cartDtl" ("cartId", "pdId", qty, price) FROM stdin;
202609240001	P002	1	590
202609240001	P003	1	250
202609240002	P003	1	250
202609240003	P003	1	250
202609240004	P003	1	250
202609240004	P001	1	350
202609240005	P002	2	590
202609240006	P003	1	250
202609240007	P002	1	590
202609240008	P001	1	350
202609240008	P003	1	250
202609240008	P002	1	590
202610270001	001	1	350
202610270002	P003	2	250
202610270002	P004	1	300
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.carts ("cartId", "cusId", "cartDate", "cartCf") FROM stdin;
202609240001	test001@gmail.com	2026-09-24	t
202609240002	test001@gmail.com	2026-09-24	t
202609240003	test1111@gmail.com	2026-09-24	t
202609240004	test1111@gmail.com	2026-09-24	t
202609240005	test001@gmail.com	2026-09-24	t
202609240006	test001@gmail.com	2026-09-24	t
202609240007	test001@gmail.com	2026-09-24	t
202609240008	test001@gmail.com	2026-09-24	t
202610270001	hello@ku.th	2026-10-27	t
202610270002	fame@gmail.com	2026-10-27	t
\.


--
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.members ("memEmail", "memName", dutyid, "memHash") FROM stdin;
test1@gmail.com	Mr.First	member	$2b$11$/UC.VkyzZdlx9JVdLUP9COLWpbRFynOUhb9DLcu8O8JHjOZcQgMKK
test3@gmail.com	Test User	member	$2b$10$p9rFSQOz20tk1UEbyAA1neWZH6DrC3PmyESQJQLWgA.odgTV4f2oO
test11@gmail.com	dsasa	member	$2b$10$Rrgpfw63LDNXdAqzKGApaeWRC.KOkBB2keoM2Dm.zGIcYCfXrSqhq
test1111@gmail.com	ds	member	$2b$10$pqTfTxZs06KTNjH2CPn8B.IZ2rNajCwKCWq8hHKVgOoxdURL5Nqum
hello@ku.th	Tammy Test	member	$2b$10$IqARZfT2is830.QKstz35OpppAsxt/GGXdVQaysykGgDowNzZc.BC
fame@gmail.com	เฟม ทอง	member	$2b$10$XFerJoZTsOk1t.fIwojTTeF9c8.mA.sQMqmDk.aOZ7VYUiiUymmpK
admin@ku.th	Admin KU	admin	$2b$10$Sf67i96gH0.vPpa/s23PmuG6Iz3MNA7HnAuDFpkFqnJriA90L6s/e
test001@gmail.com	Test001	member	$2b$10$CXLP7ZBf8OMfKUcTzkf4NefmxU4eMIe3n0wLE4cNCcHSmlio.1sfG
\.


--
-- Data for Name: pdTypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."pdTypes" ("pdTypeId", "pdTypeName") FROM stdin;
T01	มันฝรั่งแผ่นเรียบ (Flat Cut)
T02	มันฝรั่งแผ่นหยัก (Ridge Cut)
T03	มันฝรั่งแท่งกรอบ (Sticks)
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products ("pdId", "pdName", "pdPrice", "pdTypeId", "brandId", "Remark", "Createdate") FROM stdin;
001	เลย์ รสมันฝรั่งแท้ (Classic Rock Salt)	30	T01	B01	มันฝรั่งแท้ทอดกรอบ โรยเกลือหินธรรมชาติ กรอบ อร่อย กลมกล่อม	2026-10-27 22:38:45.330018+07
002	เลย์ รสโนริสาหร่าย (Nori Seaweed)	32	T01	B01	หอมกลิ่นสาหร่ายแท้จากญี่ปุ่น กรุบกรอบเคี้ยวเพลิน รสยอดนิยมตลอดกาล	2026-10-27 22:38:45.33158+07
003	พริงเกิลส์ รสซาวครีมและหัวหอม (Sour Cream & Onion)	45	T01	B02	รสชาติเข้มข้น หอมมันกลิ่นซาวครีมและหัวหอม บรรจุในกระบอกซิกเนเจอร์	2026-10-27 22:38:45.332414+07
004	เลย์ รสบาร์บีคิว (Smoky BBQ)	30	T02	B01	แผ่นหยักกรอบสะใจ คลุกเคล้าผงบาร์บีคิวรมควัน รสเข้มเต็มคำ	2026-10-27 22:38:45.332961+07
005	เทสโต รสหมึกย่างฮอตชีลลี่ (Hot Chilli Squid)	30	T02	B03	รสปลาหมึกย่างแท้ผสานพริกเผ็ดร้อน รสชาติจัดจ้านโดนใจวัยรุ่น	2026-10-27 22:38:45.333375+07
006	พริงเกิลส์ รสชีสซี่ชีส (Cheesy Cheese)	45	T01	B02	ชีสเน้นๆ หอมกรุ่น ละมุนลิ้นสำหรับคนรักชีสตัวจริง	2026-10-27 22:38:45.334111+07
007	มิสเตอร์โปเตโต้ รสฮอตแอนด์สไปซี่ (Hot & Spicy)	38	T01	B04	เผ็ดสะใจสไตล์เอเชียน กรอบอร่อยเคี้ยวเพลินทุกชิ้น	2026-10-27 22:38:45.334501+07
008	เทสโต รสต้มยำกุ้งน้ำข้น (Creamy Tom Yum)	30	T02	B03	รสชาติต้มยำกุ้งแท้สูตรเข้มข้น หอมกลิ่นมะนาวและสมุนไพรไทย	2026-10-27 22:38:45.334816+07
009	เลย์ รสทรัฟเฟิลพรีเมียม (Black Truffle)	35	T01	B01	สัมผัสความหรูหราด้วยกลิ่นเห็ดทรัฟเฟิลดำพรีเมียม กรอบ หรูหรา อร่อยลงตัว	2026-10-27 22:38:45.335131+07
010	มิสเตอร์โปเตโต้ รสไข่เค็มสไปซี่ (Spicy Salted Egg)	40	T01	B04	รสไข่เค็มแท้เข้มข้น ผสานความเผ็ดเบาๆ หอมมันไม่ซ้ำใคร	2026-10-27 22:38:45.335626+07
\.


--
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (stdid, stdname, majorid) FROM stdin;
6730200685	มาศณลินท์ โชติวัฒนสกุล	CS
6730200031	เต๋	CS01
6730200618	fame	cs
\.


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY ("brandId");


--
-- Name: cartDtl cartDtl_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."cartDtl"
    ADD CONSTRAINT "cartDtl_pkey" PRIMARY KEY ("cartId", "pdId");


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY ("cartId");


--
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY ("memEmail");


--
-- Name: pdTypes pdTypes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."pdTypes"
    ADD CONSTRAINT "pdTypes_pkey" PRIMARY KEY ("pdTypeId");


--
-- Name: products products _pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products _pkey" PRIMARY KEY ("pdId");


--
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (stdid);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO dev;


--
-- Name: TABLE brands; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.brands TO dev;


--
-- Name: TABLE "pdTypes"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public."pdTypes" TO dev;


--
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO PUBLIC;
GRANT ALL ON TABLE public.products TO dev;


--
-- Name: TABLE students; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.students TO dev;


--
-- PostgreSQL database dump complete
--

\unrestrict brS8r8Kx8cUANHUlFcCUWtzkhcPbcj2g8Fm2bYSlMFufFiQlIDObGq7YjJgQ0Go

