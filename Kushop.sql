--
-- PostgreSQL database dump
--

\restrict o3qbPjRbdoFpyo7LH5bMF3Q0ehcA6sK3dQqknsdNul59v91zl8GojyDZbichXfa

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-10-27 19:45:36

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
-- TOC entry 221 (class 1259 OID 16427)
-- Name: brands; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.brands (
    "brandId" character varying(50) NOT NULL,
    "brandName" character varying(100)
);


ALTER TABLE public.brands OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16467)
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
-- TOC entry 224 (class 1259 OID 16459)
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
-- TOC entry 223 (class 1259 OID 16448)
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
-- TOC entry 222 (class 1259 OID 16431)
-- Name: pdTypes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."pdTypes" (
    "pdTypeId" character varying(50) NOT NULL,
    "pdTypeName" character varying(100)
);


ALTER TABLE public."pdTypes" OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16404)
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
-- TOC entry 219 (class 1259 OID 16398)
-- Name: students; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.students (
    stdid character varying(50) NOT NULL,
    stdname character varying(100),
    majorid character varying(50)
);


ALTER TABLE public.students OWNER TO postgres;

--
-- TOC entry 5045 (class 0 OID 16427)
-- Dependencies: 221
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.brands ("brandId", "brandName") FROM stdin;
B01	Brand A
B02	Brand B
B03	Brand C
\.


--
-- TOC entry 5049 (class 0 OID 16467)
-- Dependencies: 225
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
\.


--
-- TOC entry 5048 (class 0 OID 16459)
-- Dependencies: 224
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
\.


--
-- TOC entry 5047 (class 0 OID 16448)
-- Dependencies: 223
-- Data for Name: members; Type: TABLE DATA; Schema: public; Owner: dev
--

COPY public.members ("memEmail", "memName", dutyid, "memHash") FROM stdin;
test1@gmail.com	Mr.First	member	$2b$11$/UC.VkyzZdlx9JVdLUP9COLWpbRFynOUhb9DLcu8O8JHjOZcQgMKK
test001@gmail.com	Test001	member	$2b$11$9AWaD/imPUgrJhvuiyYOp.M.oAup9PeIGWKt3wAPVGWwpD88S6Gk6
test3@gmail.com	Test User	member	$2b$10$p9rFSQOz20tk1UEbyAA1neWZH6DrC3PmyESQJQLWgA.odgTV4f2oO
test11@gmail.com	dsasa	member	$2b$10$Rrgpfw63LDNXdAqzKGApaeWRC.KOkBB2keoM2Dm.zGIcYCfXrSqhq
test1111@gmail.com	ds	member	$2b$10$pqTfTxZs06KTNjH2CPn8B.IZ2rNajCwKCWq8hHKVgOoxdURL5Nqum
\.


--
-- TOC entry 5046 (class 0 OID 16431)
-- Dependencies: 222
-- Data for Name: pdTypes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."pdTypes" ("pdTypeId", "pdTypeName") FROM stdin;
T01	สินค้าชนิดที่1
T02	สินค้าชนิดที่2
T03	สินค้าชนิดที่3
\.


--
-- TOC entry 5044 (class 0 OID 16404)
-- Dependencies: 220
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products ("pdId", "pdName", "pdPrice", "pdTypeId", "brandId", "Remark", "Createdate") FROM stdin;
P001	สินค้าทดสอบ	150	T01	B01	สินค้าทดสอบระบบ	2026-07-23 12:12:31.706+07
P00ๅ1	สินค้าทดสอบ	150	T01	B01	สินค้าทดสอบระบบ	2026-07-23 12:12:50.394+07
P002	สินค้าทดสอบ	150	T01	B01	สินค้าทดสอบระบบ	2026-08-06 09:49:52.219+07
P004	Product10	200	T01	B01	สินค้าใหม่	2026-08-13 08:34:11.056+07
P003	Product3	200300	T01	B01	พระเครื่อง	2026-08-13 08:35:14.615+07
\.


--
-- TOC entry 5043 (class 0 OID 16398)
-- Dependencies: 219
-- Data for Name: students; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.students (stdid, stdname, majorid) FROM stdin;
6730200685	มาศณลินท์ โชติวัฒนสกุล	CS
6730200031	เต๋	CS01
6730200618	fame	cs
\.


--
-- TOC entry 4887 (class 2606 OID 16436)
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.brands
    ADD CONSTRAINT brands_pkey PRIMARY KEY ("brandId");


--
-- TOC entry 4895 (class 2606 OID 16473)
-- Name: cartDtl cartDtl_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public."cartDtl"
    ADD CONSTRAINT "cartDtl_pkey" PRIMARY KEY ("cartId", "pdId");


--
-- TOC entry 4893 (class 2606 OID 16466)
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY ("cartId");


--
-- TOC entry 4891 (class 2606 OID 16458)
-- Name: members members_pkey; Type: CONSTRAINT; Schema: public; Owner: dev
--

ALTER TABLE ONLY public.members
    ADD CONSTRAINT members_pkey PRIMARY KEY ("memEmail");


--
-- TOC entry 4889 (class 2606 OID 16438)
-- Name: pdTypes pdTypes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."pdTypes"
    ADD CONSTRAINT "pdTypes_pkey" PRIMARY KEY ("pdTypeId");


--
-- TOC entry 4885 (class 2606 OID 16413)
-- Name: products products _pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products _pkey" PRIMARY KEY ("pdId");


--
-- TOC entry 4883 (class 2606 OID 16403)
-- Name: students students_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.students
    ADD CONSTRAINT students_pkey PRIMARY KEY (stdid);


--
-- TOC entry 5055 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT ALL ON SCHEMA public TO dev;


--
-- TOC entry 5056 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE brands; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.brands TO dev;


--
-- TOC entry 5057 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE "pdTypes"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public."pdTypes" TO dev;


--
-- TOC entry 5058 (class 0 OID 0)
-- Dependencies: 220
-- Name: TABLE products; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.products TO PUBLIC;
GRANT ALL ON TABLE public.products TO dev;


--
-- TOC entry 5059 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE students; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.students TO dev;


-- Completed on 2026-10-27 19:45:36

--
-- PostgreSQL database dump complete
--

\unrestrict o3qbPjRbdoFpyo7LH5bMF3Q0ehcA6sK3dQqknsdNul59v91zl8GojyDZbichXfa

