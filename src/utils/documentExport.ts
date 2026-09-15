import { jsPDF } from 'jspdf';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
} from 'docx';
import { saveAs } from 'file-saver';

// --- GERADOR DE PDF ---
export function generateQuestionnairePDF() {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const margin = 15;
  const pageWidth = 210;
  const contentWidth = pageWidth - margin * 2;
  let y = 15;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 280) {
      doc.addPage();
      y = 15;
      drawHeaderFooter();
    }
  };

  const drawHeaderFooter = () => {
    // Top border line
    doc.setDrawColor(217, 166, 46); // #D9A62E Gold
    doc.setLineWidth(1);
    doc.line(margin, 10, pageWidth - margin, 10);

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages();
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 160);
    doc.text(
      'Bússola Gestão Automotiva • Roteiro Oficial de Diagnóstico dos 4 Quadrantes',
      margin,
      290
    );
    doc.text(`Página ${pageCount}`, pageWidth - margin, 290, { align: 'right' });
  };

  // Header Banner
  doc.setFillColor(16, 43, 63); // #102B3F Deep Blue
  doc.rect(margin, y, contentWidth, 24, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text('ROTEIRO DE COLETA DE DADOS & DIAGNÓSTICO', margin + 6, y + 9);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(217, 166, 46); // Gold
  doc.text('MÉTODO BÚSSOLA GESTÃO AUTOMOTIVA • PAINEL DE BORDO DO GESTOR', margin + 6, y + 16);

  y += 30;

  // Intro box
  doc.setFillColor(245, 248, 250);
  doc.setDrawColor(213, 221, 226);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'FD');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(50, 65, 80);
  const introText =
    'Este formulário contém as 12 perguntas essenciais para alimentar o Painel de Bordo do Gestor. Preencha os dados reais do período avaliado (semana ou mês) para gerar o raio-x instantâneo da oficina nos 4 Quadrantes.';
  const splitIntro = doc.splitTextToSize(introText, contentWidth - 8);
  doc.text(splitIntro, margin + 4, y + 6);

  y += 24;

  const sections = [
    {
      title: 'BLOCO 0: IDENTIFICAÇÃO E PERÍODO',
      color: [16, 43, 63],
      items: [
        {
          num: '0',
          title: 'Período de Referência da Análise',
          question: 'Qual é o período de fechamento avaliado nestes números? (Ex: Mês de Julho/2026 ou Semana 12 a 18/08/2026)',
          why: 'Garante que todos os dados de faturamento, horas, custos e O.S. pertençam à mesma janela temporal.',
        },
      ],
    },
    {
      title: 'QUADRANTE 1: TERMÔMETRO DA PRODUTIVIDADE REAL (O PÁTIO)',
      color: [22, 101, 192],
      items: [
        {
          num: '1',
          title: 'Número de Mecânicos Produtivos',
          question: 'Quantos mecânicos trabalharam diretamente executando serviços no pátio durante o período?',
          why: 'Define a força de trabalho direta. (Não incluir recepcionistas, consultores ou lavadores).',
        },
        {
          num: '2',
          title: 'Horas Contratadas por Mecânico no Mês (Padrão CLT)',
          question: 'Qual a carga horária contratual mensal de cada mecânico? (Padrão de mercado: 176 h/mês).',
          why: 'Multiplicada pelo número de mecânicos, determina a Capacidade Instalada de Horas Disponíveis.',
        },
        {
          num: '3',
          title: 'Horas Faturadas no Período (Soma das O.S.)',
          question: 'Qual foi o somatório de horas de mão de obra efetivamente faturadas nas O.S. no período?',
          why: 'Mede a Produtividade Real (Horas Faturadas ÷ Horas Disponíveis). Meta Ouro: >= 85%.',
        },
      ],
    },
    {
      title: 'QUADRANTE 2: CPH REAL E ABSORÇÃO DE ESTRUTURA (FINANÇAS)',
      color: [194, 120, 3],
      items: [
        {
          num: '4',
          title: 'CFR do Motor de Serviços no Período (R$)',
          question: 'Qual o Custo Fixo de Responsabilidade alocado para manter a estrutura do setor de Serviços no período?',
          why: 'Permite calcular o CPH Ideal e o CPH Real. Avalia se a estrutura fixa está absorvida pelas horas vendidas.',
        },
      ],
    },
    {
      title: 'QUADRANTE 3: MARGEM DE CONTRIBUIÇÃO POR MOTOR (COMERCIAL)',
      color: [46, 125, 50],
      items: [
        {
          num: '5',
          title: 'Faturamento Bruto de Serviços (R$)',
          question: 'Qual foi o faturamento bruto total obtido com mão de obra/serviços no período?',
          why: 'Base de cálculo para a apuração da margem real de lucro das operações do pátio.',
        },
        {
          num: '6',
          title: 'Lucro Líquido Real de Serviços (R$)',
          question: 'Após deduzir custos diretos, impostos e CFR do pátio, quanto sobrou de lucro líquido em serviços?',
          why: 'Calcula a Margem Real de Serviços (Lucro Líquido ÷ Faturamento de Serviços).',
        },
        {
          num: '7',
          title: 'Meta de Lucro de Serviços (%)',
          question: 'Qual a meta de margem percentual estabelecida para serviços no seu VHT? (Ex: 18%, 20%)',
          why: 'Compara a entrega com o planejado para diagnosticar descontos excessivos ou precificação incorreta.',
        },
        {
          num: '8',
          title: 'Faturamento Bruto de Peças (R$)',
          question: 'Qual foi o faturamento bruto total com a venda de autopeças e insumos no período?',
          why: 'Mede o volume bruto do segundo motor financeiro da oficina.',
        },
        {
          num: '9',
          title: 'Custo de Aquisição + Impostos das Peças Vendidas (R$)',
          question: 'Qual foi o CMV (custo de compra) + impostos sobre as peças vendidas no período?',
          why: 'Subtraído do faturamento de peças, apura o Lucro Bruto / Margem de Contribuição de Peças.',
        },
        {
          num: '10',
          title: 'Meta de Cobertura do Motor de Peças (R$)',
          question: 'Qual o valor em R$ que peças precisa gerar de lucro bruto para cobrir custos e gerar contribuição?',
          why: 'Avalia se o setor de peças é autossustentável ou se depende do pátio para não ter prejuízo.',
        },
      ],
    },
    {
      title: 'QUADRANTE 4: ÍNDICE DE REFUGO OPERACIONAL (QUALIDADE)',
      color: [198, 40, 40],
      items: [
        {
          num: '11',
          title: 'Total de O.S. Faturadas',
          question: 'Quantas Ordens de Serviço foram finalizadas e entregues faturadas no período?',
          why: 'Volume total de passagens no pátio para calcular a proporção de retrabalhos.',
        },
        {
          num: '12',
          title: 'Número de Retornos em Garantia (Retrabalho)',
          question: 'Quantos veículos retornaram à oficina no período com problemas de garantia ou retrabalho?',
          why: 'Calcula o Índice de Retrabalho (Retornos ÷ O.S.). Teto de tolerância da metodologia = 1%.',
        },
      ],
    },
  ];

  sections.forEach((sec) => {
    checkPageBreak(30);

    // Section header
    doc.setFillColor(sec.color[0], sec.color[1], sec.color[2]);
    doc.rect(margin, y, contentWidth, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text(sec.title, margin + 3, y + 4.8);
    y += 10;

    sec.items.forEach((item) => {
      checkPageBreak(25);

      // Question title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(16, 43, 63);
      doc.text(`${item.num}. ${item.title}`, margin + 2, y);
      y += 4;

      // Question prompt
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(40, 50, 60);
      const splitQ = doc.splitTextToSize(`• Pergunta: ${item.question}`, contentWidth - 4);
      doc.text(splitQ, margin + 4, y);
      y += splitQ.length * 3.8;

      // Why note
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(100, 115, 130);
      const splitWhy = doc.splitTextToSize(`• Por que é necessária: ${item.why}`, contentWidth - 4);
      doc.text(splitWhy, margin + 4, y);
      y += splitWhy.length * 3.6;

      // Answer fill line / box
      doc.setDrawColor(220, 225, 230);
      doc.setFillColor(252, 253, 254);
      doc.roundedRect(margin + 4, y, contentWidth - 8, 6, 1, 1, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(180, 190, 200);
      doc.text('Resposta / Valor apurado: [ ____________________________________________________ ]', margin + 6, y + 4.2);
      y += 9;
    });

    y += 2;
  });

  drawHeaderFooter();
  doc.save('Roteiro_Diagnostico_Painel_de_Bordo.pdf');
}

// --- GERADOR DE WORD (.DOCX) ---
export async function generateQuestionnaireWord() {
  const tableBorder = {
    top: { style: BorderStyle.SINGLE, size: 1, color: 'D5DDE2' },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: 'D5DDE2' },
    left: { style: BorderStyle.SINGLE, size: 1, color: 'D5DDE2' },
    right: { style: BorderStyle.SINGLE, size: 1, color: 'D5DDE2' },
  };

  const rows = [
    new TableRow({
      children: [
        new TableCell({
          width: { size: 30, type: WidthType.PERCENTAGE },
          shading: { fill: '102B3F', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'ITEM / CAMPO', bold: true, color: 'FFFFFF', size: 18 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 45, type: WidthType.PERCENTAGE },
          shading: { fill: '102B3F', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'PERGUNTA PARA O QUESTIONÁRIO', bold: true, color: 'FFFFFF', size: 18 })],
            }),
          ],
        }),
        new TableCell({
          width: { size: 25, type: WidthType.PERCENTAGE },
          shading: { fill: '102B3F', type: ShadingType.CLEAR },
          children: [
            new Paragraph({
              children: [new TextRun({ text: 'FINALIDADE METODOLÓGICA', bold: true, color: 'FFFFFF', size: 18 })],
            }),
          ],
        }),
      ],
    }),
  ];

  const dataRows = [
    {
      quadrant: 'BLOCO 0: IDENTIFICAÇÃO',
      field: '0. Período de Referência',
      q: 'Qual é o período de fechamento avaliado nestes números? (Ex: Mês de Julho/2026 ou Semana 12 a 18/08/2026)',
      why: 'Garante a sincronia temporal de horas, receitas e custos.',
    },
    {
      quadrant: 'Q1: PRODUTIVIDADE REAL (PÁTIO)',
      field: '1. Nº de Mecânicos Produtivos',
      q: 'Quantos mecânicos trabalharam diretamente executando serviços no pátio durante o período?',
      why: 'Base direta de produção de mão de obra.',
    },
    {
      quadrant: 'Q1: PRODUTIVIDADE REAL (PÁTIO)',
      field: '2. Horas Contratadas por Mecânico',
      q: 'Qual a carga horária contratual mensal padrão de cada mecânico? (Padrão: 176 h/mês).',
      why: 'Calcula a capacidade instalada de horas disponíveis.',
    },
    {
      quadrant: 'Q1: PRODUTIVIDADE REAL (PÁTIO)',
      field: '3. Horas Faturadas no Período',
      q: 'Qual foi o somatório total de horas de mão de obra faturadas nas O.S. no período?',
      why: 'Mede a Produtividade Real (% Produtividade = Faturadas ÷ Disponíveis).',
    },
    {
      quadrant: 'Q2: CPH REAL E ABSORÇÃO (FINANÇAS)',
      field: '4. CFR do Motor de Serviços (R$)',
      q: 'Qual foi o Custo Fixo de Responsabilidade alocado para o setor de Serviços no período?',
      why: 'Permite apurar o CPH Ideal vs. CPH Real e desvios de absorção.',
    },
    {
      quadrant: 'Q3: MARGEM POR MOTOR (COMERCIAL)',
      field: '5. Faturamento Bruto de Serviços (R$)',
      q: 'Qual foi o Faturamento Bruto total obtido com Serviços no período?',
      why: 'Base de cálculo para a margem líquida de serviços.',
    },
    {
      quadrant: 'Q3: MARGEM POR MOTOR (COMERCIAL)',
      field: '6. Lucro Líquido Real de Serviços (R$)',
      q: 'Após custos diretos, impostos e CFR, quanto sobrou de lucro líquido em serviços?',
      why: 'Apurar a Margem Real de Serviços (Lucro ÷ Faturamento).',
    },
    {
      quadrant: 'Q3: MARGEM POR MOTOR (COMERCIAL)',
      field: '7. Meta de Lucro de Serviços (%)',
      q: 'Qual é a meta percentual estabelecida para a mão de obra no seu VHT? (Ex: 18%)',
      why: 'Compara a margem real com o objetivo do VHT.',
    },
    {
      quadrant: 'Q3: MARGEM POR MOTOR (COMERCIAL)',
      field: '8. Faturamento Bruto de Peças (R$)',
      q: 'Qual foi o Faturamento Bruto total obtido com a venda de Peças no período?',
      why: 'Volume de receitas do motor comercial de peças.',
    },
    {
      quadrant: 'Q3: MARGEM POR MOTOR (COMERCIAL)',
      field: '9. Custo de Aquisição + Impostos Peças (R$)',
      q: 'Qual foi o CMV somado aos impostos incidentes sobre as peças vendidas?',
      why: 'Permite calcular o Lucro Bruto / Margem de Contribuição de Peças.',
    },
    {
      quadrant: 'Q3: MARGEM POR MOTOR (COMERCIAL)',
      field: '10. Meta de Cobertura de Peças (R$)',
      q: 'Qual o valor em R$ que peças precisa gerar de lucro bruto para cobrir custos e meta?',
      why: 'Avalia a autossustentabilidade do motor de peças.',
    },
    {
      quadrant: 'Q4: QUALIDADE (RETRABALHO)',
      field: '11. Total de O.S. Faturadas',
      q: 'Quantas Ordens de Serviço foram finalizadas e entregues no período?',
      why: 'Volume amostral de passagens no pátio.',
    },
    {
      quadrant: 'Q4: QUALIDADE (RETRABALHO)',
      field: '12. Retornos em Garantia',
      q: 'Quantos carros retornaram com problemas de garantia ou retrabalho no período?',
      why: 'Mede o Refugo Operacional (Retornos ÷ O.S.). Teto tolerável: 1%.',
    },
  ];

  dataRows.forEach((item, idx) => {
    rows.push(
      new TableRow({
        children: [
          new TableCell({
            borders: tableBorder,
            shading: { fill: idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: item.field, bold: true, color: '102B3F', size: 17 }),
                  new TextRun({ text: `\n[${item.quadrant}]`, color: '8C9BA5', size: 14, italics: true }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: tableBorder,
            shading: { fill: idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [new TextRun({ text: item.q, color: '334155', size: 17 })],
              }),
            ],
          }),
          new TableCell({
            borders: tableBorder,
            shading: { fill: idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF', type: ShadingType.CLEAR },
            children: [
              new Paragraph({
                children: [new TextRun({ text: item.why, color: '64748B', size: 16, italics: true })],
              }),
            ],
          }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: 'ROTEIRO DE COLETA DE DADOS & DIAGNÓSTICO',
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: 'Bússola Gestão Automotiva • Painel de Bordo do Gestor (Método dos 4 Quadrantes)',
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'Este roteiro reúne as perguntas e justificativas metodológicas para aplicação em mentorias, consultorias e questionários de diagnóstico de oficinas mecânicas e autocenters.',
            spacing: { after: 300 },
          }),
          new Table({
            rows: rows,
            width: { size: 100, type: WidthType.PERCENTAGE },
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'Roteiro_Diagnostico_Painel_de_Bordo.docx');
}
