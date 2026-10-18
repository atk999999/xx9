/** Browser-side, on-demand Tiên Nghịch reference. No full-corpus preload. */
const ROOT = '/knowledge/tien-nghich';
type ChapterRef = {file:string;offset:number};
type PackIndex = {chapter_map:Record<string,ChapterRef>;chapter_count:number};
type Chapter = {id:number;title?:string;paragraphs?:string[]};
let indexPromise:Promise<PackIndex>|undefined;
const cache = new Map<string,Promise<{chapters:Chapter[]}>>();
async function json<T>(path:string):Promise<T> {
 const response=await fetch(path);
 if(!response.ok) throw new Error(`Tiên Nghịch: không tải được ${path} (${response.status})`);
 return response.json() as Promise<T>;
}
export async function getTienNghichChapter(chapterId:number):Promise<Chapter> {
 if(!Number.isInteger(chapterId)||chapterId<1||chapterId>2095) throw new Error('Chương không hợp lệ');
 const idx=await (indexPromise??=json<PackIndex>(`${ROOT}/package-index.json`).catch(e=>{indexPromise=undefined;throw e;}));
 const ref=idx.chapter_map[String(chapterId)];
 if(!ref || !/^packages\/pack-\d{3}\.json$/.test(ref.file)) throw new Error(`Không có chỉ mục chương ${chapterId}`);
 let p=cache.get(ref.file);
 if(!p){p=json<{chapters:Chapter[]}>(`${ROOT}/${ref.file}`).catch(e=>{cache.delete(ref.file);throw e;});cache.set(ref.file,p);if(cache.size>8)cache.delete(cache.keys().next().value!);}
 const chapter=(await p).chapters[ref.offset];
 if(chapter?.id!==chapterId)throw new Error(`Sai ánh xạ chương ${chapterId}`);
 return chapter;
}
/** Only send selected excerpts to the model, never the entire knowledge base. */
export async function getTienNghichContext(ids:number[],maxChars=9000):Promise<string> {
 const chapters=await Promise.all([...new Set(ids)].slice(0,5).map(getTienNghichChapter));
 return chapters.map(c=>`Chương ${c.id}: ${c.title||''}\n${(c.paragraphs||[]).join('\n')}`).join('\n\n').slice(0,maxChars);
}
