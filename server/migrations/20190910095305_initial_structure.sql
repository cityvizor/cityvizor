--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3
-- Dumped by pg_dump version 11.5

-- Started on 2019-09-10 13:14:41

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

--
-- TOC entry 8 (class 2615 OID 16910)
-- Name: app; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA app;


--
-- TOC entry 6 (class 2615 OID 16473)
-- Name: data; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA data;


--
-- TOC entry 683 (class 1247 OID 25282)
-- Name: import_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.import_status AS ENUM (
    'pending',
    'processing',
    'success',
    'error'
);


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 221 (class 1259 OID 25360)
-- Name: imports; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.imports (
    id integer NOT NULL,
    profile_id integer NOT NULL,
    year integer NOT NULL,
    user_id integer,
    created timestamp without time zone NOT NULL,
    started timestamp without time zone,
    finished timestamp without time zone,
    status public.import_status NOT NULL,
    error text,
    validity date
);


--
-- TOC entry 220 (class 1259 OID 25358)
-- Name: imports_id_seq; Type: SEQUENCE; Schema: app; Owner: -
--

CREATE SEQUENCE app.imports_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2970 (class 0 OID 0)
-- Dependencies: 220
-- Name: imports_id_seq; Type: SEQUENCE OWNED BY; Schema: app; Owner: -
--

ALTER SEQUENCE app.imports_id_seq OWNED BY app.imports.id;


--
-- TOC entry 209 (class 1259 OID 17022)
-- Name: profiles; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.profiles (
    id integer NOT NULL,
    status character varying DEFAULT 'hidden'::character varying NOT NULL,
    url character varying,
    name character varying,
    email character varying,
    ico character varying,
    databox character varying,
    edesky smallint,
    mapasamospravy smallint,
    gps_x numeric,
    gps_y numeric,
    main boolean DEFAULT false NOT NULL,
    avatar_type character varying,
    token_code integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 213 (class 1259 OID 17076)
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: app; Owner: -
--

CREATE SEQUENCE app.profiles_id_seq
    START WITH 4
    INCREMENT BY 1
    MINVALUE 4
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2971 (class 0 OID 0)
-- Dependencies: 213
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: app; Owner: -
--

ALTER SEQUENCE app.profiles_id_seq OWNED BY app.profiles.id;


--
-- TOC entry 211 (class 1259 OID 17035)
-- Name: user_profiles; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.user_profiles (
    user_id integer NOT NULL,
    profile_id integer NOT NULL
);


--
-- TOC entry 207 (class 1259 OID 16913)
-- Name: users; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.users (
    id integer NOT NULL,
    login character varying,
    password character varying,
    last_login timestamp with time zone,
    name character varying,
    email character varying,
    role character varying NOT NULL
);


--
-- TOC entry 206 (class 1259 OID 16911)
-- Name: users_id_seq; Type: SEQUENCE; Schema: app; Owner: -
--

CREATE SEQUENCE app.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2972 (class 0 OID 0)
-- Dependencies: 206
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: app; Owner: -
--

ALTER SEQUENCE app.users_id_seq OWNED BY app.users.id;


--
-- TOC entry 199 (class 1259 OID 16483)
-- Name: years; Type: TABLE; Schema: app; Owner: -
--

CREATE TABLE app.years (
    profile_id integer NOT NULL,
    year integer NOT NULL,
    hidden boolean DEFAULT true NOT NULL,
    validity date
);


--
-- TOC entry 200 (class 1259 OID 16499)
-- Name: accounting; Type: TABLE; Schema: data; Owner: -
--

CREATE TABLE data.accounting (
    profile_id integer,
    year integer,
    type character varying,
    paragraph integer,
    item integer,
    unit integer,
    event integer,
    amount numeric(14,2)
);


--
-- TOC entry 198 (class 1259 OID 16454)
-- Name: codelists; Type: TABLE; Schema: data; Owner: -
--

CREATE TABLE data.codelists (
    codelist character varying NOT NULL,
    id character varying NOT NULL,
    name text NOT NULL,
    description text,
    valid_from date,
    valid_till date
);


--
-- TOC entry 203 (class 1259 OID 16813)
-- Name: contracts; Type: TABLE; Schema: data; Owner: -
--

CREATE TABLE data.contracts (
    id integer NOT NULL,
    profile_id integer,
    date date,
    title text,
    counterparty text,
    amount numeric(14,2),
    currency character varying,
    url character varying
);


--
-- TOC entry 202 (class 1259 OID 16811)
-- Name: contracts_id_seq; Type: SEQUENCE; Schema: data; Owner: -
--

CREATE SEQUENCE data.contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2973 (class 0 OID 0)
-- Dependencies: 202
-- Name: contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: data; Owner: -
--

ALTER SEQUENCE data.contracts_id_seq OWNED BY data.contracts.id;


--
-- TOC entry 217 (class 1259 OID 17148)
-- Name: event_descriptions; Type: TABLE; Schema: data; Owner: -
--

CREATE TABLE data.event_descriptions (
    profile_id integer NOT NULL,
    event_id integer NOT NULL,
    year integer NOT NULL,
    category character varying,
    event_name character varying,
    organization_name character varying,
    description text
);


--
-- TOC entry 208 (class 1259 OID 16995)
-- Name: events; Type: TABLE; Schema: data; Owner: -
--

CREATE TABLE data.events (
    profile_id integer NOT NULL,
    year integer NOT NULL,
    id integer NOT NULL,
    name text NOT NULL,
    description text
);


--
-- TOC entry 215 (class 1259 OID 17099)
-- Name: noticeboards; Type: TABLE; Schema: data; Owner: -
--

CREATE TABLE data.noticeboards (
    profile_id integer NOT NULL,
    date date,
    title character varying,
    category character varying,
    document_url character varying,
    edesky_url character varying,
    preview_url character varying,
    attachments integer DEFAULT 0 NOT NULL
);


--
-- TOC entry 201 (class 1259 OID 16529)
-- Name: payments; Type: TABLE; Schema: data; Owner: -
--

CREATE TABLE data.payments (
    profile_id integer,
    year integer,
    paragraph integer,
    item integer,
    unit integer,
    event integer,
    amount numeric(14,2),
    date date,
    counterparty_id character varying,
    counterparty_name text,
    description text
);


--
-- TOC entry 210 (class 1259 OID 17031)
-- Name: years; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.years AS
 SELECT y.profile_id,
    y.year,
    y.validity
   FROM (app.years y
     JOIN app.profiles p ON ((y.profile_id = p.id)))
  WHERE ((y.hidden <> true) AND ((p.status)::text = 'visible'::text));


--
-- TOC entry 212 (class 1259 OID 17060)
-- Name: accounting; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.accounting AS
 SELECT p.id AS profile_id,
    acc.year,
    acc.type,
    acc.paragraph,
    acc.item,
    acc.unit,
    acc.event,
    sum(
        CASE
            WHEN (((acc.item < 5000) OR (acc.item >= 8000)) AND ((acc.type)::text <> 'ROZ'::text)) THEN acc.amount
            ELSE (0)::numeric
        END) AS income_amount,
    sum(
        CASE
            WHEN (((acc.item < 5000) OR (acc.item >= 8000)) AND ((acc.type)::text = 'ROZ'::text)) THEN acc.amount
            ELSE (0)::numeric
        END) AS budget_income_amount,
    sum(
        CASE
            WHEN ((acc.item >= 5000) AND (acc.item < 8000) AND ((acc.type)::text <> 'ROZ'::text)) THEN acc.amount
            ELSE (0)::numeric
        END) AS expenditure_amount,
    sum(
        CASE
            WHEN ((acc.item >= 5000) AND (acc.item < 8000) AND ((acc.type)::text = 'ROZ'::text)) THEN acc.amount
            ELSE (0)::numeric
        END) AS budget_expenditure_amount
   FROM ((app.profiles p
     LEFT JOIN data.accounting acc ON ((acc.profile_id = p.id)))
     JOIN public.years y ON (((y.year = acc.year) AND (y.profile_id = acc.profile_id))))
  GROUP BY p.id, acc.year, acc.type, acc.paragraph, acc.item, acc.unit, acc.event;


--
-- TOC entry 205 (class 1259 OID 16902)
-- Name: codelists; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.codelists AS
 SELECT codelists.codelist,
    codelists.id,
    codelists.name,
    codelists.description,
    codelists.valid_from,
    codelists.valid_till
   FROM data.codelists;


--
-- TOC entry 204 (class 1259 OID 16821)
-- Name: contracts; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.contracts AS
 SELECT contracts.id,
    contracts.profile_id,
    contracts.date,
    contracts.title,
    contracts.counterparty,
    contracts.amount,
    contracts.currency,
    contracts.url
   FROM data.contracts;


--
-- TOC entry 218 (class 1259 OID 17156)
-- Name: events; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.events AS
 SELECT e.profile_id,
    e.year,
    e.id,
    e.name,
    ed.category,
    ed.event_name,
    ed.organization_name,
    ed.description
   FROM ((data.events e
     JOIN public.years y ON (((y.year = e.year) AND (y.profile_id = e.profile_id))))
     LEFT JOIN data.event_descriptions ed ON (((ed.profile_id = e.profile_id) AND (ed.event_id = e.id) AND (ed.year = e.year))));


--
-- TOC entry 216 (class 1259 OID 17105)
-- Name: noticeboards; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.noticeboards AS
 SELECT noticeboards.profile_id,
    noticeboards.date,
    noticeboards.title,
    noticeboards.category,
    noticeboards.document_url,
    noticeboards.edesky_url,
    noticeboards.preview_url
   FROM data.noticeboards;


--
-- TOC entry 214 (class 1259 OID 17084)
-- Name: payments; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.payments AS
 SELECT payments.profile_id,
    payments.year,
    payments.paragraph,
    payments.item,
    payments.unit,
    payments.event,
        CASE
            WHEN ((payments.item < 5000) OR (payments.item >= 7000)) THEN payments.amount
            ELSE (0)::numeric
        END AS income_amount,
        CASE
            WHEN ((payments.item >= 5000) AND (payments.item < 7000)) THEN payments.amount
            ELSE (0)::numeric
        END AS expenditure_amount,
    payments.date,
    payments.counterparty_id,
    payments.counterparty_name,
    payments.description
   FROM (data.payments payments
     JOIN public.years y ON (((y.year = payments.year) AND (y.profile_id = payments.profile_id))));


--
-- TOC entry 219 (class 1259 OID 17212)
-- Name: profiles; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.profiles AS
 SELECT profiles.id,
    profiles.status,
    profiles.url,
    profiles.name,
    profiles.email,
    profiles.avatar_type,
    profiles.ico,
    profiles.databox,
    profiles.edesky,
    profiles.mapasamospravy,
    profiles.gps_x,
    profiles.gps_y,
    profiles.main
   FROM app.profiles
  WHERE ((profiles.status)::text = 'visible'::text);


--
-- TOC entry 2790 (class 2604 OID 25363)
-- Name: imports id; Type: DEFAULT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.imports ALTER COLUMN id SET DEFAULT nextval('app.imports_id_seq'::regclass);


--
-- TOC entry 2786 (class 2604 OID 17078)
-- Name: profiles id; Type: DEFAULT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.profiles ALTER COLUMN id SET DEFAULT nextval('app.profiles_id_seq'::regclass);


--
-- TOC entry 2784 (class 2604 OID 16916)
-- Name: users id; Type: DEFAULT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.users ALTER COLUMN id SET DEFAULT nextval('app.users_id_seq'::regclass);


--
-- TOC entry 2783 (class 2604 OID 16816)
-- Name: contracts id; Type: DEFAULT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.contracts ALTER COLUMN id SET DEFAULT nextval('data.contracts_id_seq'::regclass);


--
-- TOC entry 2808 (class 2606 OID 25368)
-- Name: imports imports_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.imports
    ADD CONSTRAINT imports_pkey PRIMARY KEY (id);


--
-- TOC entry 2802 (class 2606 OID 17030)
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- TOC entry 2804 (class 2606 OID 17039)
-- Name: user_profiles user_profiles_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.user_profiles
    ADD CONSTRAINT user_profiles_pkey PRIMARY KEY (user_id, profile_id);


--
-- TOC entry 2796 (class 2606 OID 16954)
-- Name: users users_login_key; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.users
    ADD CONSTRAINT users_login_key UNIQUE (login);


--
-- TOC entry 2798 (class 2606 OID 16921)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2794 (class 2606 OID 16745)
-- Name: years years_pkey; Type: CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.years
    ADD CONSTRAINT years_pkey PRIMARY KEY (profile_id, year);


--
-- TOC entry 2792 (class 2606 OID 16461)
-- Name: codelists codelists_pkey; Type: CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.codelists
    ADD CONSTRAINT codelists_pkey PRIMARY KEY (codelist, id);


--
-- TOC entry 2806 (class 2606 OID 17155)
-- Name: event_descriptions event_descriptions_pkey; Type: CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.event_descriptions
    ADD CONSTRAINT event_descriptions_pkey PRIMARY KEY (profile_id, event_id, year);


--
-- TOC entry 2800 (class 2606 OID 17002)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (profile_id, year, id);


--
-- TOC entry 2818 (class 2606 OID 17198)
-- Name: user_profiles user_profiles_profile_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.user_profiles
    ADD CONSTRAINT user_profiles_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES app.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2817 (class 2606 OID 17193)
-- Name: user_profiles user_profiles_user_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.user_profiles
    ADD CONSTRAINT user_profiles_user_id_fkey FOREIGN KEY (user_id) REFERENCES app.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2809 (class 2606 OID 17188)
-- Name: years years_profile_id_fkey; Type: FK CONSTRAINT; Schema: app; Owner: -
--

ALTER TABLE ONLY app.years
    ADD CONSTRAINT years_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES app.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2810 (class 2606 OID 17129)
-- Name: accounting accounting_profile_id_fkey; Type: FK CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.accounting
    ADD CONSTRAINT accounting_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES app.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2811 (class 2606 OID 17173)
-- Name: accounting accounting_year_fkey; Type: FK CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.accounting
    ADD CONSTRAINT accounting_year_fkey FOREIGN KEY (year, profile_id) REFERENCES app.years(year, profile_id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2814 (class 2606 OID 17124)
-- Name: contracts contracts_profile_id_fkey; Type: FK CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.contracts
    ADD CONSTRAINT contracts_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES app.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2815 (class 2606 OID 17119)
-- Name: events events_profile_id_fkey; Type: FK CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.events
    ADD CONSTRAINT events_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES app.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2816 (class 2606 OID 17178)
-- Name: events events_profile_id_fkey1; Type: FK CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.events
    ADD CONSTRAINT events_profile_id_fkey1 FOREIGN KEY (profile_id, year) REFERENCES app.years(profile_id, year) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2819 (class 2606 OID 17114)
-- Name: noticeboards noticeboards_profile_id_fkey; Type: FK CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.noticeboards
    ADD CONSTRAINT noticeboards_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES app.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2812 (class 2606 OID 17134)
-- Name: payments payments_profile_id_fkey; Type: FK CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.payments
    ADD CONSTRAINT payments_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES app.profiles(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2813 (class 2606 OID 17183)
-- Name: payments payments_profile_id_fkey1; Type: FK CONSTRAINT; Schema: data; Owner: -
--

ALTER TABLE ONLY data.payments
    ADD CONSTRAINT payments_profile_id_fkey1 FOREIGN KEY (profile_id, year) REFERENCES app.years(profile_id, year) ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2019-09-10 13:14:42

--
-- PostgreSQL database dump complete
--
 