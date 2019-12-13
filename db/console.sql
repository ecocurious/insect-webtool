insert into insects_process(name, kind) values ('stefan-test', 'manual');

drop table if exists foo;
create temp table foo as (
    select
        'https://storage.googleapis.com/eco1/frames/' || id_new as url,
        time_stamp as timestamp,
        1 as process_id,
        row_number() over (partition by event_time_stamp) as collection_id,
        id_new
    from
        src_frame_newname
);

truncate insects_frame cascade;
insert into insects_frame (url, timestamp, process_id) (
    select
        url,
        timestamp,
        process_id
    from
        foo
);

truncate insects_collection cascade;
insert into insects_collection (process_id, id)
select
    1 as process_id,
    x.collection_id as id
from
    (
    select distinct  collection_id from foo
    ) x
;

truncate insects_collection_frames;
insert into insects_collection_frames (collection_id, frame_id)
select
    foo.collection_id,
    f.id as frame_id
from
    insects_frame f
    left join foo
        on ('https://storage.googleapis.com/eco1/frames/' || foo.id_new) = f.url
