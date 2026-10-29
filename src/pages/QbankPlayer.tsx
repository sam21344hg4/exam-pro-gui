import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Item = { qid:number; position:number|null; questionUrl:string; explanationUrl:string|null; options:{label:string;text:string}[]; correctAnswer:string|null; classification:Record<string,string>; hints:{label:string;url:string}[] };
type Exam = {id:string;title:string;questions:Item[]};

function HtmlContent({url,elementId}:{url:string;elementId:string}) {
  const [html,setHtml] = useState("");
  const [error,setError] = useState("");
  useEffect(() => {
    let active = true;
    setHtml("");setError("");
    fetch(url).then(r=>{if(!r.ok)throw Error("HTTP "+r.status);return r.text();}).then(source=>{
      const doc = new DOMParser().parseFromString(source,"text/html");
      const el = doc.getElementById(elementId);
      if (!el) throw Error("Missing "+elementId);
      el.querySelectorAll("script,iframe,object,embed,form,style,svg").forEach(n=>n.remove());
      [el,...Array.from(el.querySelectorAll("*"))].forEach(node=>{
        Array.from(node.attributes).forEach(attribute=>{
          const key=attribute.name.toLowerCase();
          if(key.startsWith("on")||key==="srcdoc")node.removeAttribute(attribute.name);
          if(["src","href","poster"].includes(key)){
            try {
              const u=new URL(attribute.value,new URL(url,window.location.origin));
              if(!["http:","https:"].includes(u.protocol))node.removeAttribute(attribute.name);
              else node.setAttribute(key,u.href);
            }catch{node.removeAttribute(attribute.name);}
          }
        });
      });
      el.querySelectorAll("button").forEach(button=>{
        if(button.querySelector("img")){
          while(button.firstChild)button.parentNode?.insertBefore(button.firstChild,button);
          button.remove();
        }else button.remove();
      });
      if(active)setHtml(el.innerHTML);
    }).catch(e=>{if(active)setError(String(e));});
    return ()=>{active=false;};
  },[url,elementId]);
  if(error)return <p className="text-red-600">Saved content unavailable: {error}</p>;
  return <div className="qbank-rich" dangerouslySetInnerHTML={{__html:html}}/>;
}

export default function QbankPlayer(){
  const [tests,setTests]=useState<Exam[]>([]);
  const [testId,setTestId]=useState("");
  const [position,setPosition]=useState(0);
  const [answers,setAnswers]=useState<Record<number,string>>({});
  const [shown,setShown]=useState<Set<number>>(new Set());
  const [error,setError]=useState("");
  useEffect(()=>{
    fetch("/qbank/catalog.json").then(r=>{if(!r.ok)throw Error("No imported catalog; run the Qbank importer");return r.json();})
      .then(data=>{setTests(data.tests||[]);setTestId(data.tests?.[0]?.id||"");})
      .catch(e=>setError(String(e)));
  },[]);
  const test=tests.find(t=>t.id===testId);
  const q=test?.questions[position];
  const graded=test?.questions.filter(item=>item.correctAnswer)||[];
  const attempted=graded.filter(item=>answers[item.qid]);
  const correct=attempted.filter(item=>answers[item.qid]===item.correctAnswer).length;
  const exportCsv=()=>{
    if(!test)return;
    const rows=[["QID","position","selected","correct","result"],...test.questions.map(item=>[
      String(item.qid),String(item.position??""),answers[item.qid]||"",item.correctAnswer||"",
      !item.correctAnswer?"unscored":!answers[item.qid]?"unanswered":answers[item.qid]===item.correctAnswer?"correct":"incorrect"
    ])];
    const csv=rows.map(row=>row.map(value=>'"'+value.replace(/"/g,'""')+'"').join(",")).join("\r\n");
    const href=URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
    const link=document.createElement("a");link.href=href;link.download="exampro-"+test.id+".csv";link.click();URL.revokeObjectURL(href);
  };
  return <main className="min-h-screen bg-background p-5">
    <style>{".qbank-rich{font-size:17px;line-height:1.6;overflow-wrap:anywhere}.qbank-rich p{margin-bottom:14px}.qbank-rich img{max-width:100%;height:auto;margin:12px auto}.qbank-rich table{border-collapse:collapse;display:block;overflow:auto}.qbank-rich td,.qbank-rich th{border:1px solid #aaa;padding:8px}.qbank-rich ul,.qbank-rich ol{padding-left:25px;list-style:revert}.qbank-rich strong{font-weight:bold}.qbank-rich a{color:#1767ac;text-decoration:underline}"}</style>
    <div className="mx-auto max-w-5xl space-y-5">
      <header className="flex justify-between gap-4"><h1 className="text-2xl font-bold">Imported Qbank</h1><Link className="underline" to="/">Back to ExamPro</Link></header>
      {error&&<p role="alert" className="text-red-600">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <label>Test <select className="rounded border bg-background p-2" value={testId} onChange={e=>{setTestId(e.target.value);setPosition(0);setAnswers({});setShown(new Set());}}>
          {tests.map(t=><option key={t.id} value={t.id}>{t.title} ({t.questions.length})</option>)}
        </select></label>
        <span>Score: {correct} / {attempted.length} attempted · {graded.length} scored QIDs</span>
        <button className="rounded border px-3 py-2" onClick={exportCsv}>Export results CSV</button>
      </div>
      {q&&<section className="space-y-5 rounded-lg border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between border-b pb-3 gap-3">
          <div><h2 className="text-xl font-bold">Question {position+1} of {test?.questions.length}</h2>
            <p className="text-sm text-muted-foreground">QID {q.qid} · {Object.values(q.classification||{}).filter(Boolean).join(" / ")}</p></div>
          <div className="flex gap-2">
            <button className="rounded border px-3 py-2 disabled:opacity-40" disabled={position===0} onClick={()=>setPosition(p=>p-1)}>Previous</button>
            <button className="rounded border px-3 py-2 disabled:opacity-40" disabled={position===(test?.questions.length||0)-1} onClick={()=>setPosition(p=>p+1)}>Next</button>
          </div>
        </div>
        <HtmlContent url={q.questionUrl} elementId="question-text"/>
        <fieldset className="space-y-2"><legend className="font-bold">Choose an answer</legend>
          {q.options.map(option=><label key={option.label} className="flex cursor-pointer items-start gap-3 rounded border p-3 hover:bg-muted">
            <input type="radio" name={"q-"+q.qid} checked={answers[q.qid]===option.label}
              onChange={()=>setAnswers(old=>({...old,[q.qid]:option.label}))}/>
            <strong>{option.label}.</strong><span>{option.text}</span>
          </label>)}
        </fieldset>
        <button className="rounded bg-primary px-4 py-2 text-primary-foreground" onClick={()=>setShown(old=>new Set(old).add(q.qid))}>Show answer and explanation</button>
        {shown.has(q.qid)&&<section className="space-y-3 border-t pt-4">
          <h3 className="font-bold">Answer: {q.correctAnswer||"Unknown (unscored)"}</h3>
          {q.explanationUrl?<HtmlContent url={q.explanationUrl} elementId="question-explanation"/>:<p>No saved explanation.</p>}
          {q.hints.length>0&&<div className="space-y-2 border-t pt-3"><strong>Exhibits</strong>
            <div className="flex flex-wrap gap-2">{q.hints.map(h=><a className="rounded border p-2 text-blue-600 underline" key={h.url} href={h.url} target="_blank" rel="noreferrer">{h.label||"Exhibit"}</a>)}</div></div>}
        </section>}
      </section>}
      {test&&<nav aria-label="Question navigation" className="flex flex-wrap gap-2">
        {test.questions.map((item,i)=><button key={item.qid} title={"QID "+item.qid} className={"rounded border px-3 py-2 "+(i===position?"bg-primary text-primary-foreground":"")} onClick={()=>setPosition(i)}>{i+1}</button>)}
      </nav>}
    </div>
  </main>;
}
