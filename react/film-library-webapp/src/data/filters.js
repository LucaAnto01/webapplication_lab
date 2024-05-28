import dayjs from 'dayjs';

const FILTERS = {
  'all': { label: 'All', url: '/', filterFunction: () => true },
  'favorite': { label: 'Favorites', url: '/filter/favorite', filterFunction: film => film.favorite },
  'best': { label: 'Best Rated', url: '/filter/best', filterFunction: film => film.rating >= 5 },
  'lastmonth': { label: 'Seen Last Month', url: '/filter/lastmonth', filterFunction: film => isSeenLastMonth(film) },
  'unseen': { label: 'Unseen', url: '/filter/unseen', filterFunction: film => film.watchDate ? false : true }
};

const isSeenLastMonth = (film) => {
  if ('watchDate' in film) {  // Accessing watchDate only if defined
    const diff = film.watchDate.diff(dayjs(), 'month')
    const isLastMonth = diff <= 0 && diff > -1;      // last month
    return isLastMonth;
  }
}

export default FILTERS;