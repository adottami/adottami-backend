import Publication from '@/modules/publications/entities/publication';

export function getNameNumberList(publications: Publication[]) {
  return publications.map((publication: Publication) => parseInt(publication.name.split('_')[1]));
}

export function getNumPublications(perPage: number, page: number): number[] {
  return [...Array(perPage * page).keys()].splice(perPage * (page - 1), perPage);
}

export function addDays(numOfDays: number) {
  const date = new Date();
  date.setDate(date.getDate() + numOfDays);
  return date;
}
