$(document).ready(function () {
  // Getting references to the name input and meal container, as well as the table body
  const mealInput = $('#meal-description');

  const mealList = $('tbody');
  const mealTotals = $('tfooter');
  const mealContainer = $('.meal-container');
  let mealRevTotal = 0;
  let mealChangeLog = [];
  let mealData = [];

  // const chart1Area = $('#myBubbleChart1');
  // const chart2Area = $('#myBubbleChart2');
  // var ctx = $('#myBubbleChart');
  let chart1Data = [{}];

  // Adding event listeners to the form to create a new object, and the button to delete
  // an meal
  $(document).on('submit', '#meal-form', handlemealFormSubmit);
  $(document).on('click', '.delete-meal', handleDeleteButtonPress);
  $(document).on('click', '.update', handleUpdateButtonPress);
  $(document).on('click', '.form-check-input', handleCheckboxClick);

  // Getting the initial list of meals
  getmeals();

  // A function to handle what happens when the form is submitted to create a new meal
  function handlemealFormSubmit(event) {
    event.preventDefault();

    // Don't do anything if the name fields hasn't been filled out
    if (!mealInput.val().trim().trim()) {
      return;
    }

    console.log("mealInput: ", mealInput.val().trim());
    console.log("dealsizeInput: ", dealsizeInput.val().trim());
    console.log("dealcountInput: ", dealcountInput.val().trim());

    const mealData = {
      name: mealInput
        .val()
        .trim(),
      deal_size: dealsizeInput
        .val()
        .trim(),
      deal_count: dealcountInput
        .val()
        .trim()
    }

    console.log("mealData object: ", mealData)

    upsertmeal(mealData);

  }

  // A function for creating an meal. Calls getmeals upon completion
  function upsertmeal(mealData) {
    $.post('/api/meals', mealData)
      .then(getmeals);
  }

  // Function for creating a new list row for meals
  function createmealRow(mealData) {

    // console.log('mealData: ', mealData);
    // const deal_size_yoy_id = "deal_size_yoy" + (i + 1);
    const deal_size_yoy_id = "deal_size_yoy" + mealData.id;
    // const deal_count_yoy_id = "deal_count_yoy" + (i + 1);
    const deal_count_yoy_id = "deal_count_yoy" + mealData.id;

    const newTr = $('<tr>');
    newTr.data('meal', mealData);
    newTr.append('<td>' + mealData.name + '</td>');
    newTr.append('<td>$' + mealData.deal_size + '</td>');
    newTr.append('<td>' + mealData.deal_count + '</td>');
    newTr.append('<td>$' + mealData.sgmt_rev + '</td>');

    console.log("mealData.deal_size_yoy: ",mealData.deal_size_yoy);
    if (mealData.deal_size_yoy) {
      newTr.append('<td>' + '<input placeholder=' + mealData.deal_size_yoy + ' id=' + deal_size_yoy_id + ' type="text" />' + '</td>');
    } else {
      newTr.append('<td>' + '<input placeholder="+/-  %"' + 'id=' + deal_size_yoy_id + ' type="text" />' + '</td>');
    }

    if (mealData.deal_count_yoy) {
      newTr.append('<td>' + '<input placeholder=' + mealData.deal_count_yoy + ' id=' + deal_count_yoy_id + ' type="text" />' + '</td>');
    } else {
      newTr.append('<td>' + '<input placeholder="+/-  %"' + 'id=' + deal_count_yoy_id + ' type="text" />' + '</td>');
    }

    // Potentially only show button, if change field is populated?
    newTr.append('<td>' + '<button class="btn btn-success update">></button>' + '</td>');

    if (!mealData.next_year_deal_size) {
      newTr.append('<td>$' + mealData.deal_size + '</td>');
    }
    else {
    newTr.append('<td>$' + mealData.next_year_deal_size + '</td>');
    }

    if (!mealData.next_year_deal_count) {
      newTr.append('<td>$' + mealData.deal_count + '</td>');
    }
    else {
    newTr.append('<td>' + mealData.next_year_deal_count + '</td>');
    }

    if (!mealData.next_year_sgmt_rev) {
      newTr.append('<td>$' + mealData.sgmt_rev + '</td>');
    }
    else {
      newTr.append('<td>$' + mealData.next_year_sgmt_rev + '</td>');
    };
    //10.05 Testing change to button class
    // newTr.append('<td> <button class="btn btn-success update"><a style=\'cursor:pointer;color:white;\' href=\'/submeal?meal_id=' + mealData.id + '\' /a> >> </button></td>');
    newTr.append('<td> <button class="btn btn-success"><a style=\'cursor:pointer;color:white;\' href=\'/submeal?meal_id=' + mealData.id + '\' /a> >> </button></td>');
    //10.05 End test

    if (mealData.Submeals) {
      newTr.append('<td> ' + mealData.Submeals.length + '</td>');
    } else {
      newTr.append('<td>0</td>');
    }
    // newTr.append('<td><a style=\'cursor:pointer;color:green;font-size:24px\' href=\'/sms?meal_id=' + mealData.id + '\'>...</a></td>');
    // newTr.append('<td><a style=\'cursor:pointer;color:green;font-size:24px\' href=\'/submeal?meal_id=' + mealData.id + '\'>...</a></td>');
    newTr.append('<td><a style=\'cursor:pointer;color:green;font-size:24px\' href=\'/submeal?meal_id=' + mealData.id + '\'>...</a></td>');
    newTr.append('<td><a style=\'cursor:pointer;color:red\' class=\'delete-meal\'>X</a></td>');

    console.log("mealData: ", mealData);

    buildChartObject(mealData);

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

      mealRevTotal = 0;
      nextyearSgmtRevTotal = 0;
      const rowsToAdd = [];

      for (let i = 0; i < data.length; i++) {
        rowsToAdd.push(createmealRow(data[i], i));

        // Calculating total meal revenue
        mealRevTotal += data[i].sgmt_rev;
        if (!data[i].next_year_sgmt_rev) {
          nextyearSgmtRevTotal += data[i].sgmt_rev;
        }
        else {
          nextyearSgmtRevTotal += data[i].next_year_sgmt_rev;
        };

        console.log("i: ", i);
        console.log("data.length: ", data.length);
        if ((i + 1) == data.length) {
          rowsToAdd.push(createmealTotals("TOTAL", mealRevTotal, nextyearSgmtRevTotal));
        }
      }

      console.log("mealRevTotal: ", mealRevTotal);
      // console.log("rowsToAdd: ", rowsToAdd);

      rendermealList(rowsToAdd);
      mealInput.val('');
    });

  }

  // A function for rendering the list of meals to the page
  function rendermealList(rows) {
    // mealList.children().not(':last').remove();
    // mealContainer.children('.alert').remove();
    if (rows.length) {
        // segmentList.prepend(rows);
        $("#mealsummary-table")
          // .find('tbody')
          .find('thead')
          .append(rows);
      } 
    //   else {
    //     renderEmpty();
    //   }  
  }

  // This populates the object for the Revenue Bubble Chart(s)
  function buildChartObject(mealData) {

    chart1Data.push({
      x: mealData.deal_size,
      y: mealData.deal_count,
      r: (mealData.sgmt_rev / 100)
    });

    chart2Data.push({
      x: mealData.next_year_deal_size,
      y: mealData.next_year_deal_count,
      r: (mealData.next_year_sgmt_rev / 100)
    });

    renderChart1(chart1Data);
    renderChart2(chart2Data);

  }

  // This creates the display object for the Revenue Bubble Chart(s)
  function renderChart1(chartData) {
    console.log("chart1 data: ", chartData);
    var ctx = $('#myBubbleChart1');

    var myBubbleChart = new Chart(ctx, {
      type: 'bubble',
      data: {
        "datasets": [{
          label: "meal Revenue - This Year",
          data: chartData,
          backgroundColor:
            'red'
        }]
      },
      options: {
        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Deal Size ($)',
            },
            ticks: {
              beginAtZero: true
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Deal Count (#)',
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
  }

  function handleUpdateButtonPress() {

    const listItemData = $(this).parent('td').parent('tr').data('meal');
    // console.log("listItemData: ", listItemData);

    const id = listItemData.id;
    // console.log("listItemData.id: ", listItemData.id);

    let nextyearDealsize = 0;
    let nextyearDealcount = 0;

    const dealsizeyoychangeInput = $('#deal_size_yoy' + listItemData.id);
    const dealcountyoychangeInput = $('#deal_count_yoy' + listItemData.id);

    // console.log('dealsizeyoychangeInput: ', dealsizeyoychangeInput.val());
    if (dealsizeyoychangeInput === '') {
      nextyearDealsize = listItemData.deal_size;
      // console.log("nextyearDealsize: ", nextyearDealsize);
    } else {
      nextyearDealsize = (listItemData.deal_size * (1 + (dealsizeyoychangeInput.val() / 100)));
      // console.log("nextyearDealsize: ", nextyearDealsize);
    }

    // console.log('dealcountyoychangeInput: ', dealcountyoychangeInput.val());
    if (dealcountyoychangeInput === '') {
      nextyearDealcount = listItemData.deal_count;
      // console.log("nextyearDealcount: ", nextyearDealcount);
    } else {
      nextyearDealcount = (listItemData.deal_count * (1 + (dealcountyoychangeInput.val() / 100)));
      // console.log("nextyearDealcount: ", nextyearDealcount);
    }

    const nextyearSgmtrev = (nextyearDealsize * nextyearDealcount);
    // console.log("nextyearSgmtrev: ", nextyearSgmtrev);


    const mealData = {
      id: listItemData.id,
      name: listItemData.name,
      deal_size: listItemData.deal_size,
      deal_count: listItemData.deal_count,
      deal_size_yoy: dealsizeyoychangeInput.val() * 1,
      deal_count_yoy: dealcountyoychangeInput.val() * 1,
      next_year_deal_size: nextyearDealsize,
      next_year_deal_count: nextyearDealcount,
      next_year_sgmt_rev: nextyearSgmtrev
    }

    console.log("mealData object: ", mealData)


    $.ajax({
      method: 'PUT',
      url: '/api/meals',
      data: mealData,
    })
      .then(getmeals);
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

});
