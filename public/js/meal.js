$(document).ready(function () {
  // Getting references to the name input and meal container, as well as the table body
  const mealDate = $('#meal-date');
  const mealInput = $('#meal-description');
  const vegInput = $('#vegetable-description');
  const carbInput = $('#carb-description');

  // const mealList = $('tbody');
  const mealList = $("#mealsummary-table");
  const mealTotals = $('tfooter');
  // const mealContainer = $('.meal-container');
  const mealContainer = $('.mealsummary-container');
  let mealRevTotal = 0;
  let mealChangeLog = [];
  let mealData = [];
  let proteinData = "";
  let chickenCount = 0;
  let beefCount = 0;
  let porkCount = 0;
  let fishCount = 0;
  let vegetarianCount = 0;
  let otherCount = 0;

  // const chart1Area = $('#myBubbleChart1');
  // const chart2Area = $('#myBubbleChart2');
  // var ctx = $('#myBubbleChart');
  let chart1Data = [{}];

  // Adding event listeners to the form to create a new object, and the button to delete
  // an meal
  $(document).on('submit', '#mealinput-form', handleMealFormSubmit);
  $(document).on('click', '.delete-meal', handleDeleteButtonPress);
  $(document).on('click', '.form-check-input', handleCheckboxClick);

  // Getting the initial list of meals
  getmeals();

  // A function to handle what happens when the form is submitted to create a new meal
  function handleMealFormSubmit(event) {
    event.preventDefault();

    console.log("mealDate: ", mealDate.val());

    // Don't do anything if the name fields hasn't been filled out
    if (!mealInput.val().trim().trim()) {
      return;
    }

    console.log("mealInput: ", mealInput.val().trim());

    for (let i = 0; i < mealChangeLog.length; i++) {
      // console.log("mealChangeLog: ", mealChangeLog);
      if (proteinData.length == 0) {
        proteinData = mealChangeLog[i].id.substr(0, (mealChangeLog[i].id.indexOf('_')));
        console.log("proteinData: ", proteinData);
      } else {
        proteinData = proteinData + ", " + mealChangeLog[i].id.substr(0, (mealChangeLog[i].id.indexOf('_')));
        console.log("proteinData: ", proteinData);
      };
    };

    const mealData = {
      date: mealDate
        .val(),
      meal: mealInput
        .val()
        .trim(),
      protein: proteinData,
      vegetable: vegInput
        .val()
        .trim(),
      carb: carbInput
        .val()
        .trim()
    }

    // console.log("mealData object: ", mealData)

    upsertmeal(mealData);

    location.reload();
  }

  // A function for creating an meal. Calls getmeals upon completion
  function upsertmeal(mealData) {
    $.post('/api/meals', mealData)
    .then(getmeals);
  }

  // Function for creating a new list row for meals
  function createmealRow(mealData) {

    console.log('mealData: ', mealData);

    const newTr = $('<tr>');
    newTr.data('meal', mealData);
    newTr.append('<td>' + mealData.date + '</td>');
    newTr.append('<td>' + mealData.meal + '</td>');
    newTr.append('<td>' + mealData.protein + '</td>');
    newTr.append('<td>' + mealData.vegetable + '</td>');
    newTr.append('<td>' + mealData.carb + '</td>');

    // newTr.append('<td> <button class="btn btn-success"><a style=\'cursor:pointer;color:white;\' href=\'/submeal?meal_id=' + mealData.id + '\' /a> >> </button></td>');

    // newTr.append('<td><a style=\'cursor:pointer;color:green;font-size:24px\' href=\'/submeal?meal_id=' + mealData.id + '\'>...</a></td>');
    newTr.append('<td><a style=\'cursor:pointer;color:red\' class=\'delete-meal\'>X</a></td>');

    // buildChartObject(mealData);

    return newTr;
  }

  // Function for creating a new list row for meals
  function createmealTotals(title, mealTotals, nextyearSgmtTotals) {

    const totalTr = $('<tr>');
    // totalTr.data('totals', mealTotals);
    totalTr.append('<td><h4><b>' + title + '</b></h4></td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td><h4><b>$' + mealTotals + '</b></h4></td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td><h4><b>$' + nextyearSgmtTotals + '</b></h4></td>');
    return totalTr;
  }


  // Function for retrieving meals and getting them ready to be rendered to the page
  function getmeals() {

    chart1Data = [{}];

    $.get('/api/meals', function (data) {

      console.log('data: ', data);
      let mealSort = data;
      console.log('mealSort: ', mealSort);

      const rowsToAdd = [];

      // for (let i = 0; i < data.length; i++) {
        for (let i = 0; i < mealSort.length; i++) {
          mealSort.sort( compare );
      }

      console.log('mealSort (sorted): ', mealSort);

      for (let i = 0; i < data.length; i++) {
        console.log("data[i].protein: ", data[i].protein);
        //Count proteins
        switch (data[i].protein) {
          case "chicken":
            chickenCount++;
            break;
          case "beef":
            beefCount++;
            break;
          case "pork":
            porkCount++;
            break;
          case "fish":
            fishCount++;
            break;
          case "vegetarian":
            vegetarianCount++;
            break;
          case "other":
            otherCount++;
            break;
        }
        //Build table rows
        rowsToAdd.push(createmealRow(data[i], i));
        if ((i + 1) == data.length) {
          rowsToAdd.push(data[i]);
        }
      }
      console.log("chickenCount: ", chickenCount);
      console.log("beefCount: ", beefCount);
      console.log("porkCount: ", porkCount);
      console.log("fishCount: ", fishCount);
      console.log("vegetarianCount: ", chickenCount);
      console.log("otherCount: ", otherCount);

      chart1Data.push({ x: "chicken", y: chickenCount });
      chart1Data.push({ x: beefCount, y: "beef" });
      chart1Data.push({ x: porkCount, y: "pork" });
      chart1Data.push({ x: fishCount, y: "fish" });
      chart1Data.push({ x: vegetarianCount, y: "vegetarian" });
      chart1Data.push({ x: otherCount, y: "other" });

      console.log("rowsToAdd: ", rowsToAdd);

      rendermealList(rowsToAdd);
      renderChart1(chart1Data);

      mealInput.val('');
    });

  }

  // A function for rendering the list of meals to the page
  function rendermealList(rows) {
    mealList.children().not(':last').remove();
    mealContainer.children('.alert').remove();
    if (rows.length) {
      mealList
      // .find('thead')
      // .find('tbody')
        .append(rows);
    }
    //   else {
    //     renderEmpty();
    //   }  
  }

  // This populates the object for the Revenue Bubble Chart(s)
  // function buildChartObject(mealData) {
  //   renderChart1(chart1Data);
  // }

  // This creates the display object for the Revenue Bubble Chart(s)
  function renderChart1(chartData) {
    console.log("chartData: ", chartData);
    var ctx = $('#myBubbleChart1');

    var myBubbleChart = new Chart(ctx, {
      type: 'horizontalBar',
      // type: 'bar',
      data: {
        labels: ["Chicken", "Beef", "Pork", "Fish", "Vegetarian", "Other"],
        datasets: [
          {
            label: "Protein Count",
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            data: [chickenCount, beefCount, porkCount, fishCount, vegetarianCount, otherCount],
          }
        ]
      },
      options: {
        borderWidth: 2,
        scales: {
          xAxes: [{
            stacked: false,
            scaleLabel: {
              display: true,
              labelString: 'Occurrences',
            },
            ticks: {
              beginAtZero: true,
                min: 0,
                stepSize: 1
            },
          }],
          yAxes: [{
            stacked: false,
            scaleLabel: {
              display: true,
              labelString: 'Protein',
            },
            ticks: {
              beginAtZero: true
            },
          }],
        }
      }
    });

    ctx.prepend(myBubbleChart);
  }

  // Function for handling what to render when there are no meals
  //   function renderEmpty() {
  //     const alertDiv = $('<div>');
  //     alertDiv.addClass('alert alert-danger');
  //     alertDiv.text('You must create a meal before you can create a Submeal.');
  //     mealContainer.append(alertDiv);
  //   }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    const listItemData = $(this).parent('td').parent('tr').data('meal');

    const id = listItemData.id;
    $.ajax({
      method: 'DELETE',
      url: '/api/meals/' + id,
    })
      .then(getmeals);

      // window.location.reload();
      location.reload();

  }

  function handleCheckboxClick(e) {

    //Identifies field clicked 
    console.log("e.target.id: ", e.target.id);
    if (e.target.value == 'unchecked') {
      e.target.value = 'checked';
    } else {
      e.target.value = 'unchecked';
    }
    //Reads value of field clicked 
    // console.log("this.val(): ", $(this).val());
    console.log(e.target.id, ": ", e.target.value);

    // Build object to capture each change
    const change_id = e.target.id;
    const change_value = e.target.value;

    const change_data = {
      id: change_id,
      value: change_value,
    };

    mealChangeLog.push(change_data);
    console.log("mealChangeLog: ", mealChangeLog);
  };

  function compare( a, b ) {
    if ( a.date < b.date ){
      return -1;
    }
    if ( a.date > b.date ){
      return 1;
    }
    return 0;
  }

});
