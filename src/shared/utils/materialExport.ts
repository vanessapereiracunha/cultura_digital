import type { LessonPlanContent, ActivityContent, ActivityQuestion } from "../../features/materiais/models";

const letras = ["a", "b", "c", "d", "e"];

export function buildLessonPlanHtml(params: {
  conteudo: LessonPlanContent;
  disciplina: string;
  serieAno: string;
  unidadeNome: string;
}): string {
  const data = params.conteudo;

  return `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="utf-8" />
        <title>Plano de Aula - ${data.titulo || params.unidadeNome}</title>
        <style>
          @page { size: A4; margin: 16mm; }
          * { box-sizing: border-box; }
          body { font-family: Arial, Helvetica, sans-serif; padding: 24px; color: #000; line-height: 1.5; }
          h1, h2, h3 { margin: 0 0 8px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
          th, td { border: 1px solid #000; padding: 8px 10px; font-size: 13px; text-align: left; }
          .header-table td { font-weight: 600; }
          .section { margin-bottom: 20px; }
          .section-title { font-weight: 800; font-size: 14px; border-bottom: 2px solid #000; padding-bottom: 4px; margin-bottom: 10px; }
          .item { margin: 6px 0; padding-left: 16px; font-size: 13px; }
          .item::before { content: "• "; }
          .numbered-item { margin: 8px 0; font-size: 13px; }
          .bncc-item { background: #f5f5f5; padding: 6px 10px; margin: 4px 0; font-size: 12px; border-left: 3px solid #000; }
        </style>
      </head>
      <body>
        <table class="header-table">
          <tr>
            <td colspan="3" style="text-align: center; font-size: 16px; font-weight: 800;">PLANO DE AULA</td>
          </tr>
          <tr>
            <td>DISCIPLINA: ${params.disciplina}</td>
            <td>SÉRIE/ANO: ${data.serieAno || params.serieAno}</td>
            <td>DURAÇÃO: ${data.duracao || "2 aulas"}</td>
          </tr>
          <tr>
            <td colspan="3">TEMA: ${data.titulo || params.unidadeNome}</td>
          </tr>
        </table>

        <div class="section">
          <div class="section-title">OBJETIVOS DE APRENDIZAGEM</div>
          ${Array.isArray(data.objetivos) ? data.objetivos.map((obj) => `<div class="item">${obj}</div>`).join("") : ""}
        </div>

        ${Array.isArray(data.conteudoProgramatico) && data.conteudoProgramatico.length > 0 ? `
        <div class="section">
          <div class="section-title">CONTEÚDO PROGRAMÁTICO</div>
          ${data.conteudoProgramatico.map((cont) => `<div class="item">${cont}</div>`).join("")}
        </div>
        ` : ""}

        ${Array.isArray(data.bncc) && data.bncc.length > 0 ? `
        <div class="section">
          <div class="section-title">HABILIDADES BNCC / CIEB</div>
          ${data.bncc.map((skill) => `<div class="bncc-item">${skill}</div>`).join("")}
        </div>
        ` : ""}

        <div class="section">
          <div class="section-title">ESTRATÉGIAS DE ENSINO</div>
          ${Array.isArray(data.estrategiasEnsino) ? data.estrategiasEnsino.map((step, i) => `<div class="numbered-item"><strong>${i + 1}.</strong> ${step}</div>`).join("") : ""}
        </div>

        <div class="section">
          <div class="section-title">AVALIAÇÃO</div>
          <div class="item">${typeof data.avaliacao === "string" ? data.avaliacao : JSON.stringify(data.avaliacao)}</div>
        </div>

        ${Array.isArray(data.recursos) && data.recursos.length > 0 ? `
        <div class="section">
          <div class="section-title">RECURSOS NECESSÁRIOS</div>
          ${data.recursos.map((rec) => `<div class="item">${rec}</div>`).join("")}
        </div>
        ` : ""}

        ${Array.isArray(data.referencias) && data.referencias.length > 0 ? `
        <div class="section">
          <div class="section-title">REFERÊNCIAS</div>
          ${data.referencias.map((ref) => `<div class="item">${ref}</div>`).join("")}
        </div>
        ` : ""}
      </body>
      </html>
    `;
}

export function buildActivityHtml(params: {
  conteudo: ActivityContent;
  disciplina: string;
  serieAno: string;
}): string {
  const data = params.conteudo;
  const perguntas: ActivityQuestion[] = Array.isArray(data.questions) ? data.questions as ActivityQuestion[] : [];

  const gabaritoTexto = perguntas.map((q, i) => `${i + 1}. ${getGabaritoTexto(q)}`).join("<br>");

  const questoesHtml = perguntas.map((q, i) => {
    const alternativas = Array.isArray(q.alternativas) ? q.alternativas : [];
    const linhas = alternativas.map((alt, idx) => {
      const letra = letras[idx] ?? "";
      const texto = alt.replace(/^[a-e]\)\s*/i, "");
      return `<div class="alt">${letra}) ${texto}</div>`;
    }).join("");
    return `
      <div class="question">
        <p style="margin: 0 0 8px 0; font-size: 16px;"><strong>${i + 1}.</strong> ${q.enunciado || ""}</p>
        ${linhas}
      </div>
    `;
  }).join("");

  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Atividade - ${params.disciplina}</title>
        <style>
          * { box-sizing: border-box; }
          body { font-family: "Inter", Arial, sans-serif; padding: 24px; color: #0f172a; }
          h1, h2, h3 { margin: 0 0 8px; }
          .titulo-escola { text-align: center; color: #ffffff; letter-spacing: 1px; margin-bottom: 10px; text-transform: uppercase; font-weight: 600; }
          .barra { border-top: 2px solid #0f172a; margin: 4px 0 12px; }
          .subtitulo { text-align: center; font-weight: 700; margin-bottom: 14px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
          th, td { border: 1px solid #0f172a; padding: 8px; font-size: 13px; text-align: left; }
          th { background: #ffffff; }
          .assinatura { font-size: 13px; font-weight: 600; padding: 10px; border: 1px solid #0f172a; }
          .atencao { border: 1px solid #0f172a; padding: 10px 12px; background: #ffffff; }
          .atencao h3 { margin: 0 0 6px; }
          .atencao ul { margin: 0; padding-left: 18px; }
          .bncc { background: #ffffff; padding: 8px 12px; border-radius: 8px; margin-bottom: 4px; }
          .question { margin: 18px 0; padding: 0; border: none; }
          .question h3 { margin: 0 0 8px 0; font-size: 18px; font-weight: 700; }
          .alt { margin: 2px 0; padding: 0; font-size: 16px; line-height: 1.5; }
          .page-break { page-break-before: always; margin-top: 40px; }
          .grid-header { border: 1px solid #0f172a; border-collapse: collapse; width: 100%; margin-bottom: 12px; }
          .grid-header td, .grid-header th { border: 1px solid #0f172a; padding: 8px 10px; font-size: 13px; }
          .grid-label { font-weight: 800; }
          .line-fill { border-bottom: 1px solid #0f172a; height: 16px; margin-top: 4px; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <table>
            <colgroup>
              <col class="c1" />
              <col class="c2" />
              <col class="c3" />
            </colgroup>
            <tr>
              <td>NOME DO ALUNO:</td>
              <td>Nº:</td>
              <td>ANO/SÉRIE: ${params.serieAno}</td>
            </tr>
            <tr>
              <td>DISCIPLINA: ${params.disciplina}</td>
              <td colspan="2">PROFESSOR (A):</td>
            </tr>
            <tr>
              <td>BIMESTRE:</td>
              <td>DATA:</td>
              <td class="nota">NOTA:</td>
            </tr>
            <tr>
              <td class="attn-wrap" colspan="3">
                <div class="attn">
                  <h3>ATENÇÃO</h3>
                  <ul>
                    <li>Usar <strong>APENAS</strong> caneta preta ou azul nas respostas; outra cor ou a lápis <strong>IMPEDE</strong> a revisão da correção.</li>
                    <li>Colocar o nome completo e identificação do número de chamada no cabeçalho.</li>
                    <li>Não usar corretivo, apenas fazer um risco sobre a palavra.</li>
                    <li>Há apenas uma opção correta em cada questão de múltipla escolha.</li>
                  </ul>
                </div>
              </td>
            </tr>
          </table>
        </div>

        ${questoesHtml}

        ${perguntas.length ? `
          <div class="page-break"></div>
          <div class="sheet">
            <table style="width:100%; border-collapse:collapse; table-layout:fixed;">
              <tr><td style="font-weight:800; padding:12px 16px; border:1px solid #000;">GABARITO</td></tr>
              <tr>
                <td style="padding:14px 16px; border:1px solid #000; font-size:14px; line-height:1.5;">
                  ${gabaritoTexto}
                </td>
              </tr>
            </table>
          </div>
        ` : ""}
      </body>
    </html>
  `;
}

function getGabaritoTexto(q: ActivityQuestion): string {
  const corretaStr = (q?.correta || "").toString().trim();
  const match = corretaStr.match(/^([a-e])\)?/i);
  const letra = match ? match[1].toLowerCase() : "";
  const idx = letras.indexOf(letra);
  const alternativa = idx >= 0 ? q?.alternativas?.[idx] : undefined;
  if (!letra) return "-";
  if (!alternativa) return letra + ")";
  const textoLimpo = alternativa.replace(/^[a-e]\)\s*/i, "");
  return letra + ") " + textoLimpo;
}
