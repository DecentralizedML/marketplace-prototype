import moment from 'moment';

export const processDataForTimeSeries = job => {
  let allNames = {};

  job.results.forEach(({ data, exif }) => {
    data.forEach(d => {
      if (d.confidence < .2) {
        return;
      }

      allNames[d.name] = 0;
    })
  })

  const preprocessed = job.results
    .reduce((map, { data, exif }) => {
      data.forEach(d => {
        if (d.confidence < .2) {
          return;
        }

        let date;

        if (exif.DateTime) {
          date = moment(exif.DateTime, 'YYYY:MM:DD kk:mm:ss')
            .format('YYYY-MM');
          if (date === 'Invalid date') {
            date = moment(exif.DateTime).format('YYYY-MM');
          }
        } else {
          date = moment()
            .subtract(Math.floor(Math.random() * 180), 'days')
            .format('YYYY-MM');
        }


        map[date] = map[date] || { ...allNames };
        map[date][d.name] = map[date][d.name] || 0

        allNames[d.name]++;
        map[date][d.name]++;

        return map;
      });
      return map
    }, {});

  const filtered = [];

  Object.entries(preprocessed)
    .forEach(([ date, items ]) => {
      if (date === 'Invalid date') return;
      filtered.push({ date, ...items });
    })

  allNames = Object.entries(allNames)
    .reduce((map, [ name, count ]) => {
      if (count) {
        map[name] = count;
      }

      return map;
    }, {})

  filtered.sort((a, b) => {
    if (a.date < b.date) {
      return -1
    }

    if (a.date > b.date) {
      return 1;
    }

    return 0;
  });
  console.log(filtered);
  return {
    data: filtered,
    allNames,
  };
}

export const processDataForPie = job => {
  const preprocessed = job.results
    .reduce((map, { data }) => {
      data.forEach(d => {
        if (d.confidence < .2) {
          return;
        }

        map[d.name] = map[d.name] || 0;
        map[d.name]++;

        return map;
      });
      return map
    }, {});

  const data = Object.entries(preprocessed)
    .map(([ name, count ]) => ({ name, count }));

  return {
    data,
  };
}
