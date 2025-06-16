--
-- PostgreSQL database dump
--

-- Dumped from database version 15.10 (Homebrew)
-- Dumped by pg_dump version 15.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: certifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.certifications (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.certifications OWNER TO postgres;

--
-- Name: certifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.certifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.certifications_id_seq OWNER TO postgres;

--
-- Name: certifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.certifications_id_seq OWNED BY public.certifications.id;


--
-- Name: job_applications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.job_applications (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    message text,
    job_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cv_path character varying(255)
);


ALTER TABLE public.job_applications OWNER TO postgres;

--
-- Name: job_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.job_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.job_applications_id_seq OWNER TO postgres;

--
-- Name: job_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.job_applications_id_seq OWNED BY public.job_applications.id;


--
-- Name: rentalrequests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rentalrequests (
    id integer NOT NULL,
    machineid integer NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(50) NOT NULL,
    company character varying(255),
    startdate date NOT NULL,
    enddate date NOT NULL,
    location character varying(500) NOT NULL,
    message text,
    status character varying(50) DEFAULT 'Pendente'::character varying,
    createdat timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rentalrequests OWNER TO postgres;

--
-- Name: rentalrequests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rentalrequests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rentalrequests_id_seq OWNER TO postgres;

--
-- Name: rentalrequests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rentalrequests_id_seq OWNED BY public.rentalrequests.id;


--
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    category character varying(50) NOT NULL,
    features text[],
    icon character varying(100),
    image_url text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.services OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.services_id_seq OWNER TO postgres;

--
-- Name: services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.services_id_seq OWNED BY public.services.id;


--
-- Name: certifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certifications ALTER COLUMN id SET DEFAULT nextval('public.certifications_id_seq'::regclass);


--
-- Name: job_applications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications ALTER COLUMN id SET DEFAULT nextval('public.job_applications_id_seq'::regclass);


--
-- Name: rentalrequests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentalrequests ALTER COLUMN id SET DEFAULT nextval('public.rentalrequests_id_seq'::regclass);


--
-- Name: services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services ALTER COLUMN id SET DEFAULT nextval('public.services_id_seq'::regclass);


--
-- Data for Name: certifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.certifications (id, name, description, created_at, updated_at) FROM stdin;
1	ISO 9001:2015	Sistema de Gestão da Qualidade	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
2	ISO 14001:2015	Sistema de Gestão Ambiental	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
3	OHSAS 18001	Segurança e Saúde no Trabalho	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
4	Alvará 4ª Classe	Obras Especializadas	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
\.


--
-- Data for Name: job_applications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.job_applications (id, name, email, phone, message, job_id, created_at, cv_path) FROM stdin;
1	João Silva	joao.silva@example.com	912345678	Gostaria de candidatar-me a esta vaga.	1	2025-06-10 15:44:20.788985	\N
2	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	teste	2	2025-06-10 15:53:29.338783	\N
3	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	teste	2	2025-06-10 15:59:35.135	\N
4	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	teste	3	2025-06-10 16:07:55.249449	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1749568075236-484666832.pdf
5	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	teste	4	2025-06-10 16:12:15.849123	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1749568335837-412565913.pdf
6	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	teste	2	2025-06-10 16:19:01.665111	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1749568741651-271156132.pdf
7	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	teste	3	2025-06-10 16:26:18.202397	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1749569178191-170019382.pdf
8	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	teste	3	2025-06-10 16:34:26.460521	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1749569666448-424507168.pdf
9	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	teste	1	2025-06-10 16:37:01.205861	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1749569821196-457972008.pdf
10	Rodrigo 	rodrigomt@sapo.pt	+351 966 545 381	teste	4	2025-06-15 12:54:22.822646	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1749988462813-929676103.pdf
11	Rodrigo 	rodrigomt@sapo.pt	+351 966 545 381	teste	4	2025-06-15 12:54:50.081407	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1749988490072-707740090.pdf
12	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	teste	4	2025-06-16 11:14:22.9586	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1750068862950-41900264.pdf
13	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	teste	3	2025-06-16 11:17:37.551568	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1750069057505-223049298.pdf
14	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	teste	4	2025-06-16 11:18:55.26699	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1750069135259-89919144.pdf
15	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	teste	4	2025-06-16 11:21:07.990138	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1750069267981-369423179.pdf
16	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	teste	3	2025-06-16 11:21:49.499854	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1750069309492-252348331.pdf
17	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	teste	4	2025-06-16 11:24:16.680353	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1750069456670-687086689.pdf
18	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	teste	3	2025-06-16 11:26:00.167564	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1750069560160-172719737.pdf
19	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	teste	4	2025-06-16 11:26:52.520167	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1750069612510-521662089.pdf
20	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	teste	1	2025-06-16 11:34:36.30319	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1750070076293-515663673.pdf
21	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	teste	2	2025-06-16 11:39:43.93198	/Users/miranda/Desktop/JPC Rodrigues/JPC-WEBSITE/jpc-backend/uploads/cvs/cv-1750070383924-152190007.pdf
\.


--
-- Data for Name: rentalrequests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rentalrequests (id, machineid, name, email, phone, company, startdate, enddate, location, message, status, createdat) FROM stdin;
1	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	1way	2003-01-25	2004-03-28	teste	teste	Pendente	2025-06-16 10:36:34.107017+01
2	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	1way	2003-01-25	2004-03-28	teste	teste	Pendente	2025-06-16 10:37:50.453459+01
3	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	1way	2003-01-25	2004-03-28	teste	teste	Pendente	2025-06-16 10:38:58.314077+01
4	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	1way	2003-01-25	2003-01-26	teste	teste	Pendente	2025-06-16 10:39:22.736551+01
5	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	1way	2003-01-25	2003-01-26	teste	teste	Pendente	2025-06-16 10:41:04.908514+01
6	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	1way	2003-01-25	2003-01-26	teste	teste	Pendente	2025-06-16 10:43:46.439658+01
7	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966545381	1way	2003-01-25	2003-01-26	teste	teste	Pendente	2025-06-16 10:44:23.69504+01
8	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	1way	2003-01-25	2003-01-25	teste	teste	Pendente	2025-06-16 10:51:38.153204+01
9	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	1way	2003-01-25	2003-01-25	teste	teste	Pendente	2025-06-16 10:52:59.288508+01
10	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	1way	2003-01-25	2003-01-25	teste	teste	Pendente	2025-06-16 10:53:48.208803+01
11	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	1way	2003-01-25	2003-01-25	teste	teste	Pendente	2025-06-16 10:54:05.657079+01
12	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	1way	2003-01-25	2003-01-25	teste	teste	Pendente	2025-06-16 10:54:43.1774+01
13	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	1way	2003-01-25	2003-01-25	teste	teste	Pendente	2025-06-16 10:55:44.214965+01
14	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	1way	2003-01-25	2003-01-25	teste	teste	Pendente	2025-06-16 10:59:53.068071+01
15	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	1way	2003-01-25	2003-01-25	teste	teste	Pendente	2025-06-16 11:00:45.283283+01
16	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	1way	2003-01-25	2003-01-25	teste	teste	Pendente	2025-06-16 11:02:09.529157+01
17	1	Rodrigo Miranda	rodrigomt@sapo.pt	+351 966 545 381	1way	2003-01-25	2003-01-25	teste	teste	Pendente	2025-06-16 11:42:23.414287+01
\.


--
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.services (id, title, description, category, features, icon, image_url, created_at, updated_at) FROM stdin;
4	Abertura de vãos em paredes e lajes	\N	complementar	\N	\N	\N	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
5	Regularização de superfícies	\N	complementar	\N	\N	\N	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
6	Furação para climatização	\N	complementar	\N	\N	\N	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
7	Instalação de sistemas de ancoragem	\N	complementar	\N	\N	\N	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
8	Corte de juntas de dilatação	\N	complementar	\N	\N	\N	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
9	Reparação de estruturas de betão	\N	complementar	\N	\N	\N	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
3	Demolição Controlada	Demolição seletiva com técnicas avançadas, preservando estruturas adjacentes.	principal	{"Demolição hidrodemolição","Remoção seletiva","Técnicas não destrutivas","Controlo de poeira"}	Shield	http://localhost:5173/demolicao_controlada_servicos.jpeg	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
1	Corte de Betão	Corte preciso e limpo em betão armado com equipamentos profissionais de última geração.	principal	{"Corte com disco diamantado","Espessuras até 80cm","Corte húmido e seco","Acabamento perfeito"}	Drill	http://localhost:5173/corte_de_betao_servicos.jpeg	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
2	Furação Profissional	Furação de alta precisão para instalações técnicas, ancoragens e passagens.	principal	{"Furação até 500mm de diâmetro","Profundidade até 3 metros","Sistemas de aspiração","Controlo de vibração"}	Hammer	http://localhost:5173/perfurador_diamantado_dd.avif	2025-06-09 12:30:21.350551	2025-06-09 12:30:21.350551
\.


--
-- Name: certifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.certifications_id_seq', 4, true);


--
-- Name: job_applications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.job_applications_id_seq', 21, true);


--
-- Name: rentalrequests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rentalrequests_id_seq', 17, true);


--
-- Name: services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.services_id_seq', 9, true);


--
-- Name: certifications certifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.certifications
    ADD CONSTRAINT certifications_pkey PRIMARY KEY (id);


--
-- Name: job_applications job_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.job_applications
    ADD CONSTRAINT job_applications_pkey PRIMARY KEY (id);


--
-- Name: rentalrequests rentalrequests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rentalrequests
    ADD CONSTRAINT rentalrequests_pkey PRIMARY KEY (id);


--
-- Name: services services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

