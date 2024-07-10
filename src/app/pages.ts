import { Page, Section } from './types';

const sections: Section[] = [
  { name: 'Cover', start: 1 },
  { name: 'Authors', start: 2 },
  { name: 'Dedication', start: 3 },
  { name: 'Introduction', start: 4 },
  { name: 'Table of Contents', start: 5 },
  { name: 'Blank Page', start: 6, hidden: true },
  { name: 'Unit 1', start: 7, end: 24 },
  { name: 'Unit 2', start: 25, end: 41 },
  { name: 'Unit 3', start: 42, end: 62 },
  { name: 'Revision 1', start: 63, end: 67 },
  { name: 'Unit 4', start: 68, end: 86 },
  { name: 'Unit 5', start: 87, end: 103 },
  { name: 'Unit 6', start: 104, end: 121 },
  { name: 'Revision 2', start: 122, end: 125 },
  { name: 'Unit 7', start: 126, end: 140 },
  { name: 'Unit 8', start: 141, end: 159 },
  { name: 'Unit 9', start: 160, end: 178 },
  { name: 'Revision 3', start: 179, end: 182 },
  { name: 'Unit 10', start: 183, end: 197 },
  { name: 'Unit 11', start: 198, end: 213 },
  { name: 'Unit 12', start: 214, end: 228 },
  { name: 'Revision 4', start: 229, end: 232 },
  { name: 'Appendix 1', start: 233, end: 235 },
  { name: 'Appendix 2', start: 236, end: 238 },
  { name: 'Appendix 3', start: 239, end: 240 },
  { name: 'Appendix 4', start: 241, end: 252 },
  { name: 'Acknowledgements', start: 253 },
];

const pages: Page[] = [];

sections.forEach((section) => {
  if (!section.end) {
    pages.push({ title: section.name, index: section.start });
    return;
  }

  for (let i = section.start; i <= section.end; i++) {
    pages.push({
      index: i,
      title: `${section.name} - p. ${i - 6}`,
    });
  }

  section.name += ` - p. ${section.start - 6}`;
});

export default { sections: sections.filter((s) => !s.hidden), pages };
