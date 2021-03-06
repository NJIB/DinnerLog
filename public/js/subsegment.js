$(document).ready(function () {
  /* global moment */

  // blogContainer holds all of our subsegments
  const blogContainer = $('.subsegment-container');
  const subsegmentCategorySelect = $('#category');

  //Array of objects to hold data for upsert to Routes table
  let subsegmentChangeLog = [];
  let progfamChangeLog = [];
  let togChangeLog = [];
  let subsegmentsData = [];

  let blankSubsegment = {
    SegmentId: '',
    RouteId: '',
    acquisition: '',
    buyers: '',
    hurdle: '',
    markets: '',
    offerings: '',
    productivity: '',
    reputation: '',
    demand: '',
    engagement: '',
    enablement: '',
    intelligence: ''
  };

  const newTr = $('<tr>');
  const segmentRowsToAdd = [];
  const subsegmentRowsToAdd = [];
  // const segmentList = $('.segment-list');
  // const subsegmentList = $('.subsegment-list');
  const segmentList = $('tbody');
  const subsegmentList = $('tbody');
  const segmentContainer = $('.segment-container');
  const subsegmentContainer = $('.subsegment-container');

  // let chart1Data = [{}];
  // let chart2Data = [{}];

  // Click events for the edit and delete buttons
  // $(document).on('click', 'button.delete-subsegment', handleSubSegmentDelete);
  $(document).on('click', '.delete-subsegment', handleSubSegmentDelete);
  $(document).on('click', 'button.edit', handleSubSegmentEdit);
  $(document).on('click', '.form-check-input', handleCheckboxClick);
  $(document).on('change', '.progfam-input', programFamilyUpdate);
  $(document).on('submit', '#subsegments-form', handleRoutesFormSubmit);
  // $(document).on('click', '#subseg_submit', handleRoutesFormSubmit);
  $(document).on('click', '.ddSelect', dropdownValue);
  $(document).on('click', '.update', handleRoutesFormSubmit);

  // Variable to hold our subsegments
  let subsegments;
  const subsegmentIndex = "0123456789";
  let rowCount = 0;
  let nextSubsegmentId = '';
  let subsegmentRecordFound = false;
  let testId = '';
  let searchString = '';
  let RouteIdRef = '';
  let menuvar = '';

  let NEWsegment = '';
  let NEWsubsegments = '';

  // The code below handles the case where we want to get subsegments for a specific segment
  // Looks for a query param in the url for segment_id - DO I NEED?
  const url = window.location.search;
  console.log("url: ", url);

  //Identifying the segment ID for the page loaded
  let segmentId;

  // Getting Segment info
  // getSegments();
  getSegData();
  getSubsegData();


  //Pulling segment data from database
  async function getSegData() {
    const segData = await segAPICall();
  }

  //Function to pull segment data
  function segAPICall() {
    return new Promise(nbSeg => {
      $.get('/api/meals', function (data) {
        NEWsegment = data;
        console.log("NEWsegment: ", NEWsegment);

        segmentRevTotal = 0;
        nextyearSgmtRevTotal = 0;

        for (let i = 0; i < NEWsegment.length; i++) {
          const idMatch = ((NEWsegment[i].id / 1) - (segmentId / 1));
          // console.log("idMatch: ", idMatch);

          if (idMatch == 0) {
            // console.log("*** Segment id matches: ", segmentId, " ***")
            // console.log("segment[i]: ", NEWsegment[i])
            segmentRowsToAdd.push(createSegmentRow(NEWsegment[i], i));
          };

          rendersegmentList(segmentRowsToAdd);
        };
      });
    })
  }

  //Pulling subsegment data from database
  async function getSubsegData() {

    //If segment ID found, pull the data from the db for that segment
    if (url.indexOf('?segment_id=') !== -1) {
      segmentId = url.split('=')[1];
      // console.log("segmentId: ", segmentId);    
      segmentURL = '/?segment_id=' + segmentId;
      // console.log("segmentURL: ", segmentURL);
      const subsegData = await subsegAPICall(segmentURL);
    }
  }

  //Function to pull subsegment data
  function subsegAPICall(segmentURL) {
    return new Promise(nbSubseg => {
      $.get('/api/subsegments' + segmentURL, function (data) {
        NEWsubsegments = data;
        console.log("NEWsubsegments: ", NEWsubsegments);
        // console.log("NEWsubsegments.length: ", NEWsubsegments.length);

        //Defining ID for blank row
        // nextSubsegmentId = segmentId + subsegmentIndex.substring(NEWsubsegments.length, NEWsubsegments.length + 1);
        nextSubsegmentId = segmentId + (getRandomInt(0, 1000));
        console.log("nextSubsegmentId: ", nextSubsegmentId);

        //Create subsegment rows for this segment
        for (let i = 0; i < NEWsubsegments.length; i++) {
          subsegmentRowsToAdd.push(createSubSegmentRow(NEWsubsegments[i]));
          console.log("subsegmentRowsToAdd: ", subsegmentRowsToAdd);
        };

        //Add in blank row in subsegment table - to capture new entries
        subsegmentRowsToAdd.push(createBlankRow(NEWsegment, nextSubsegmentId));

        //Render subsegments to the screen
        renderSubsegmentList(subsegmentRowsToAdd);
      })
    })
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  // Function for retrieving segments and getting them ready to be rendered to the page
  function getSegments() {

    getSegData();

    $.get('/api/meals', function (data) {
      let segment = data;
      console.log("segment: ", segment);

      segmentRevTotal = 0;
      nextyearSgmtRevTotal = 0;

      for (let i = 0; i < segment.length; i++) {
        const idMatch = ((segment[i].id / 1) - (segmentId / 1));
        // console.log("idMatch: ", idMatch);

        if (idMatch == 0) {
          console.log("*** Segment id matches: ", segmentId, " ***")
          console.log("data[i]: ", data[i])
          console.log("segment[i]: ", segment[i])

          segmentRowsToAdd.push(createSegmentRow(segment[i], i));

          nextSubsegmentId = segmentId + subsegmentIndex.substring(0, 1);
          console.log("nextSubsegmentId: ", nextSubsegmentId);

          // console.log("subsegments exist?: ", subsegments.length);
          console.log("subsegments exist?: ", NEWsubsegments.length);
          if (NEWsubsegments.length > 0) {
            segmentRowsToAdd.push(createBlankRow(segment[i], i));
          };
        };
      };
      console.log("segmentRowsToAdd: ", segmentRowsToAdd);
      rendersegmentList(segmentRowsToAdd);
    });
  }


  // This function grabs subsegments from the database and updates the view
  // function getSubSegments(segment) {

  //   segmentId = segment || '';
  //   console.log("segmentId: ", segmentId);

  //   if (segmentId) {
  //     segmentURL = '/?segment_id=' + segmentId;
  //   }

  //   //API Call to get data for specific subsegment
  //   $.get('/api/subsegments' + segmentURL, function (data) {
  //     subsegments = data;
  //     console.log("subsegments: ", subsegments);
  //   });

  //   subsegmentRowsToAdd.push(createSubSegmentRow(subsegments));
  //   console.log("subsegmentRowsToAdd: ", subsegmentRowsToAdd);

  // }



  // This function does an API call to delete subsegments
  function deleteSubSegment(id) {
    console.log("id: ", id);

    $.ajax({
      method: 'DELETE',
      url: '/api/subsegments/' + id,
    })
      .then(function () {
        location.reload();
        // getSubSegments(subsegmentCategorySelect.val());
      });
  }



  // InitializeRows handles appending all of our constructed subsegment HTML inside blogContainer
  function initializeRows() {
    blogContainer.empty();
    console.log("subsegments: ", subsegments);
    console.log("subsegments.length: ", subsegments.length);
    const subsegmentsToAdd = [];
    for (let i = 0; i < subsegments.length; i++) {
      subsegmentsToAdd.push(createNewRow(subsegments[i]));
    }
    blogContainer.append(subsegmentsToAdd);
  }

  // This function constructs a subsegment's HTML
  // function createNewRow(subsegment) {
  //   let formattedDate = new Date(subsegment.createdAt);
  //   formattedDate = moment(formattedDate).format('MMMM Do YYYY, h:mm:ss a');

  //   // console.log("subsegment: ", subsegment);

  //   const newSubSegmentCard = $('<div>');
  //   newSubSegmentCard.addClass('card');

  //   const newSubSegmentCardHeading = $('<div>');
  //   newSubSegmentCardHeading.addClass('card-header');

  //   const deleteBtn = $('<button>');
  //   deleteBtn.text('x');
  //   deleteBtn.addClass('delete btn btn-danger');

  //   const editBtn = $('<button>');
  //   editBtn.text('EDIT');
  //   editBtn.addClass('edit btn btn-info');

  //   const newSubSegmentTitle = $('<h2>');
  //   const newSubSegmentDate = $('<small>');
  //   const newSubSegmentSegment = $('<h5>');
  //   newSubSegmentSegment.text('Written by: ' + subsegment.Segment.name);
  //   newSubSegmentSegment.css({
  //     'float': 'right',
  //     'color': 'blue',
  //     'margin-top':
  //       '-10px',
  //   });

  //   const newSubSegmentCardBody = $('<div>');
  //   newSubSegmentCardBody.addClass('card-body');

  //   const newSubSegmentBody = $('<p>');
  //   newSubSegmentTitle.text(subsegment.title + ' ');
  //   newSubSegmentBody.text(subsegment.body);
  //   newSubSegmentDate.text(formattedDate);
  //   newSubSegmentTitle.append(newSubSegmentDate);
  //   newSubSegmentCardHeading.append(deleteBtn);
  //   newSubSegmentCardHeading.append(editBtn);
  //   newSubSegmentCardHeading.append(newSubSegmentTitle);
  //   newSubSegmentCardHeading.append(newSubSegmentSegment);
  //   newSubSegmentCardBody.append(newSubSegmentBody);
  //   newSubSegmentCard.append(newSubSegmentCardHeading);
  //   newSubSegmentCard.append(newSubSegmentCardBody);
  //   newSubSegmentCard.data('subsegment', subsegment);
  //   return newSubSegmentCard;
  // }

  // This function displays a message when there are no subsegments
  // function displayEmpty(id) {
  //   const query = window.location.search;
  //   let partial = '';
  //   if (id) {
  //     partial = ' for Segment #' + id;
  //   }
  //   blogContainer.empty();
  //   const messageH2 = $('<h2>');
  //   messageH2.css({ 'text-align': 'center', 'margin-top': '50px' });
  //   messageH2.html('No subsegments yet' + partial + ', navigate <a href=\'/sms' + query +
  //     '\'>here</a> in order to get started.');
  //   blogContainer.append(messageH2);
  // }

  function dropdownValue(e) {
    menuvar = $(this).text();
    console.log("menuvar: ", menuvar);
    const menuvarId = $(this)[0].id;
    console.log("menuvarId: ", menuvarId);

    const tog_data = {
      id: menuvarId,
      value: menuvar,
      segmentId: segmentId
    };
    console.log("tog_data: ", tog_data);

    //Building log of changes to upload to db
    togChangeLog.push(tog_data);
    console.log("togChangeLog: ", togChangeLog);

    renderSubsegmentList(subsegmentRowsToAdd);
  }


  function programFamilyUpdate(e) {

    //Reads value of field clicked 
    // console.log("this.val(): ", $(this).val());
    console.log("e.target.id: ", e.target.id);
    console.log("e.target.value: ", e.target.value);
    // console.log("e: ", e);

    // Build object to capture each change
    const progfam_id = e.target.id;
    const progfam_value = e.target.value;

    const progfam_data = {
      id: progfam_id,
      value: progfam_value,
      segmentId: segmentId
    };
    console.log("progfam_data: ", progfam_data);

    //Building log of changes to upload to db
    progfamChangeLog.push(progfam_data);
    console.log("progfamChangeLog: ", progfamChangeLog);
  }

  function handleCheckboxClick(e) {

    //Resetting flag
    subsegmentRecordFound = false;

    //Identifies field clicked 
    // console.log("e.target.id: ", e.target.id);
    if (e.target.value == 'unchecked') {
      e.target.value = 'checked';
    } else {
      e.target.value = 'unchecked';
    }
    //Reads value of field clicked 
    // console.log("this.val(): ", $(this).val());
    console.log(e.target.id, ": ", e.target.value);
    // console.log("e: ", e);

    // Build object to capture each change
    const change_id = e.target.id;
    const change_value = e.target.value;

    const change_data = {
      id: change_id,
      value: change_value,
      segmentId: segmentId
    };
    // console.log("change_data: ", change_data);

    //Building log of changes to upload to db
    subsegmentChangeLog.push(change_data);
    // console.log("subsegmentChangeLog: ", subsegmentChangeLog);

    // console.log("NEWsubsegments: ", NEWsubsegments);

    // if (!NEWsubsegments || !NEWsubsegments.length) {
    //   console.log("NO SUBSEGMENTS FOUND")
    // } else {
    //   console.log("SUBSEGMENT", NEWsubsegments[0].SegmentId.toString(), "FOUND");
    // };


    searchString = e.target.id.substr((e.target.id.indexOf('_') + 1), e.target.id.length);
    console.log("searchString: ", searchString);

    //Looping through subsegmentsData, to update clicks
    console.log("subsegmentsData: ", subsegmentsData);
    for (var i = 0; i < subsegmentsData.length; i++) {

      if (subsegmentsData[i].RouteId.toString() == e.target.id.substr((e.target.id.indexOf('_') + 1), e.target.id.length)) {
        console.log("MATCH!");

        // Defining IDs to be referenced when updating the SubSegments table
        subsegmentRecordFound = true;
        console.log("subsegmentRecordFound: ", subsegmentRecordFound);

        const hurdle_id = ("hurdle_" + subsegmentsData[i].RouteId);
        // console.log("hurdle_id: ", hurdle_id);
        const markets_id = ("markets_" + subsegmentsData[i].RouteId);
        // console.log("markets_id: ", markets_id);
        const buyers_id = ("buyers_" + subsegmentsData[i].RouteId);
        // console.log("buyers_id: ", buyers_id);
        const offerings_id = ("offerings_" + subsegmentsData[i].RouteId);
        // console.log("offerings_id: ", offerings_id);
        const productivity_id = ("productivity_" + subsegmentsData[i].RouteId);
        // console.log("productivity_id: ", productivity_id);
        const acquisition_id = ("acquisition_" + subsegmentsData[i].RouteId);
        // console.log("acquisition_id: ", acquisition_id);

        // const hurdle_desc = $('#' + hurdle_id);
        // console.log('hurdle_desc:', hurdle_desc.val().trim());
        // subsegmentsData[i].hurdle = hurdle_desc.val().trim();

        console.log("subsegmentChangeLog: ", subsegmentChangeLog);

        //Looping through subsegmentChangeLog, and updating subsegmentsData if match found
        subsegmentChangeLog.forEach(change => {
          if (change.id == change_id) {
            subsegmentsData[i].markets = change_value;
          };

          if (buyers_id == change_id) {
            subsegmentsData[i].buyers = change_value;
          };

          if (offerings_id == change_id) {
            subsegmentsData[i].offerings = change_value;
          };

          if (productivity_id == change_id) {
            subsegmentsData[i].productivity = change_value;
          };

          if (acquisition_id == change_id) {
            subsegmentsData[i].acquisition = change_value;
          };
        })
      }
    }

    // console.log("subsegmentsData: ",subsegmentsData);
    console.log("subsegmentRecordFound: ", subsegmentRecordFound);

    if (subsegmentRecordFound == false) {

      console.log("No subsegment record found");

      const hurdle_id = ("hurdle_" + searchString);
      const markets_id = ("markets_" + searchString);
      const buyers_id = ("buyers_" + searchString);
      const offerings_id = ("offerings_" + searchString);
      const productivity_id = ("productivity_" + searchString);
      const acquisition_id = ("acquisition_" + searchString);

      console.log("change_id: ", change_id);
      console.log("change_value: ", change_value);

      blankSubsegment.SegmentId = segmentId;
      console.log("blankSubsegment.SegmentId: ", blankSubsegment.SegmentId);
      blankSubsegment.RouteId = e.target.id.substr((e.target.id.indexOf('_') + 1), e.target.id.length);
      console.log("blankSubsegment.RouteId: ", blankSubsegment.RouteId);

      subsegmentChangeLog.forEach(change => {
        if (markets_id == change_id) {
          blankSubsegment.markets = change_value;
        };

        if (buyers_id == change_id) {
          blankSubsegment.buyers = change_value;
        };

        if (offerings_id == change_id) {
          blankSubsegment.offerings = change_value;
        };

        if (productivity_id == change_id) {
          blankSubsegment.productivity = change_value;
        };

        if (acquisition_id == change_id) {
          blankSubsegment.acquisition = change_value;
        };
      })
      blankSubsegment.hurdle = ($('#hurdle_' + searchString).val());
      console.log("blankSubsegment.hurdle: ", blankSubsegment.hurdle);
    };

    console.log("blankSubsegment: ", blankSubsegment);
    console.log("subsegmentsData: ", subsegmentsData);

  };



  // This function figures out which subsegment we want to delete and then calls deleteSubSegment
  function handleSubSegmentDelete() {
    console.log("Deleting subsegment record!");

    const currentSubSegment = $(this)
      .parent()
      .parent()
      .data('subsegment');

    console.log("currentSubSegment: ", currentSubSegment);
    console.log("currentSubSegment.RouteId: ", currentSubSegment.id);

    deleteSubSegment(currentSubSegment.id);
  }



  // This function figures out which subsegment we want to edit and takes it to the appropriate url
  function handleSubSegmentEdit() {
    const currentSubSegment = $(this)
      .parent()
      .parent()
      .data('subsegment');
    window.location.href = '/sms?subsegment_id=' + currentSubSegment.id;
  }



  // A function to handle what happens when the form is submitted to create a new subsegment record
  function handleRoutesFormSubmit(event) {
    event.preventDefault();

    console.log("blankSubsegment: ", blankSubsegment);
    console.log("subsegmentsData: ", subsegmentsData);

    let blankRowUpsert = [];
    blankRowUpsert.push(blankSubsegment);
    console.log("blankRowUpsert: ", blankRowUpsert);
    upsertRoutes(blankRowUpsert);

    //Need to pull down existing records from the database - to determine if it needs to be POST or a PUT

    //If no subsegment records exist
    // if (!subsegmentsData || !subsegmentsData.length) {
    console.log("subsegmentRecordFound: ", subsegmentRecordFound);
    if (subsegmentRecordFound == false) {

      console.log("subsegmentRecordFound false -- creating new row");

      createNewRoute();

      // console.log("Upserting new route to database")

      // let newSubsegment = {
      //   SegmentId: '',
      //   RouteId: '',
      //   acquisition: '',
      //   buyers: '',
      //   hurdle: '',
      //   markets: '',
      //   offerings: '',
      //   productivity: ''
      // };

      // //Build subsegmentsData object for upserting
      // subsegmentChangeLog.forEach(change => {
      //   console.log("change.id: :", change.id);
      //   console.log("change.value: :", change.value);
      //   console.log("change.segmentId: :", change.segmentId);

      //   newSubsegment.SegmentId = change.segmentId;
      //   console.log(" newSubsegment.SegmentId: ", newSubsegment.SegmentId);
      //   newSubsegment.RouteId = change.id.substr((change.id.indexOf('_') + 1), change.id.length);
      //   console.log(" newSubsegment.RouteId: ", newSubsegment.RouteId);

      //   switch (change.id.substr(0, (change.id.indexOf('_')))) {
      //     case "markets":
      //       newSubsegment.markets = change.value;
      //       break;
      //     case "buyers":
      //       newSubsegment.buyers = change.value;
      //       break;
      //     case "offerings":
      //       newSubsegment.offerings = change.value;
      //       break;
      //     case "productivity":
      //       newSubsegment.productivity = change.value;
      //       break;
      //     case "acquisition":
      //       newSubsegment.acquisition = change.value;
      //       break;
      //   }

      //   //Ensure Hurdle text included in upsert / update record
      //   let hurdle_id = ($('#hurdle_' + change.id.substr((change.id.indexOf('_') + 1), change.id.length)));
      //   // console.log("hurdle_id: ", hurdle_id);
      //   let hurdle_value = hurdle_id.val();
      //   console.log("hurdle_value: ", hurdle_value);

      //   newSubsegment.hurdle = hurdle_value;
      //   console.log("newSubsegment: ", newSubsegment);

      //   subsegmentsData.push(newSubsegment);
      //   console.log("subsegmentsData: ", subsegmentsData);
      // })
      // upsertRoutes(subsegmentsData);

    }
    else
      //If subsegment records do exist
      console.log("subsegmentRecordFound true -- updating existing row");

    {
      console.log("subsegmentsData: ", subsegmentsData);

      for (let i = 0; i < subsegmentsData.length; i++) {
        console.log("subsegmentsData object: ", subsegmentsData[i]);

        //Checking each item in change log, to see if it matches the subsegment record
        subsegmentChangeLog.forEach(update => {

          let searchId = update.id.substr((update.id.indexOf('_') + 1), update.id.length);
          console.log("searchId: ", searchId);

          if (searchId == subsegmentsData[i].RouteId) {
            console.log("*** Subsegment match: ", searchId, subsegmentsData[i].RouteId, " ***");

            subsegmentRecordFound = true;
            console.log("subsegmentRecordFound: ", subsegmentRecordFound);

            switch (update.id) {
              case ("markets_" + searchId):
                subsegmentsData[i].markets = update.value;
                break;
              case ("buyers_" + searchId):
                subsegmentsData[i].buyers = update.value;
                break;
              case ("offerings_" + searchId):
                subsegmentsData[i].offerings = update.value;
                break;
              case ("productivity_" + searchId):
                subsegmentsData[i].productivity = update.value;
                break;
              case ("acquisition_" + searchId):
                subsegmentsData[i].acquisition = update.value;
                break;
            }

            let hurdle_id = ('#hurdle_' + searchId);
            let hurdle_value = $(hurdle_id).val();
            console.log("hurdle_value: ", hurdle_value);
            if (hurdle_value != subsegmentsData[i].hurdle && hurdle_value != '') {
              console.log("Updating hurdle value!")
              subsegmentsData[i].hurdle = hurdle_value;
            }

            console.log("subsegmentsData[i]: ", subsegmentsData[i]);

            console.log("UPDATING!");
            // updateRouteInfo(subsegments, subsegmentsData[i])
            updateRouteInfo(subsegmentsData[i])

          }
        });
        console.log("subsegmentsData: ", subsegmentsData);


        // console.log("blankSubsegment: ", blankSubsegment);
        // subsegmentsData = [];
        // blankRowUpsert = [];
      };

    };
    // getSubsegData();
    subsegmentChangeLog = [];
    location.reload();
  };


  function createNewRoute() {
    console.log("*** Creating new route in database ***")

    let newSubsegment = {
      SegmentId: '',
      RouteId: '',
      acquisition: '',
      buyers: '',
      hurdle: '',
      markets: '',
      offerings: '',
      productivity: ''
    };

    //Build subsegmentsData object for upserting
    subsegmentChangeLog.forEach(change => {
      console.log("change.id: :", change.id);
      console.log("change.value: :", change.value);
      console.log("change.segmentId: :", change.segmentId);

      newSubsegment.SegmentId = change.segmentId;
      console.log(" newSubsegment.SegmentId: ", newSubsegment.SegmentId);
      newSubsegment.RouteId = change.id.substr((change.id.indexOf('_') + 1), change.id.length);
      console.log(" newSubsegment.RouteId: ", newSubsegment.RouteId);

      switch (change.id.substr(0, (change.id.indexOf('_')))) {
        case "markets":
          newSubsegment.markets = change.value;
          break;
        case "buyers":
          newSubsegment.buyers = change.value;
          break;
        case "offerings":
          newSubsegment.offerings = change.value;
          break;
        case "productivity":
          newSubsegment.productivity = change.value;
          break;
        case "acquisition":
          newSubsegment.acquisition = change.value;
          break;
      }

      //Ensure Hurdle text included in upsert / update record
      let hurdle_id = ($('#hurdle_' + change.id.substr((change.id.indexOf('_') + 1), change.id.length)));
      // console.log("hurdle_id: ", hurdle_id);
      let hurdle_value = hurdle_id.val();
      console.log("hurdle_value: ", hurdle_value);

      newSubsegment.hurdle = hurdle_value;
      console.log("newSubsegment: ", newSubsegment);

      subsegmentsData.push(newSubsegment);
      console.log("subsegmentsData: ", subsegmentsData);
    })
    console.log("subsegmentsData: ", subsegmentsData);
    // upsertRoutes(subsegmentsData);
  }


  // A function for updating the SubSegment table record
  function updateRouteInfo(newDetails) {
    // function updateRouteInfo(oldRecord, newDetails) {
    // console.log("oldRecord: ", oldRecord[0]);
    console.log("newDetails: ", newDetails);

    // for (let i = 0; i < oldRecord.length; i++) {
    //   subsegmentChangeLog.forEach(change => {

    //     switch (change.id) {
    //       case ("markets_" + oldRecord[i].SegmentId):
    //         oldRecord[i].markets = change.value;
    //         break;
    //       case ("buyers_" + oldRecord[i].SegmentId):
    //         oldRecord[i].buyers = change.value;
    //         break;
    //       case ("offerings_" + oldRecord[i].SegmentId):
    //         oldRecord[i].offerings = change.value;
    //         break;
    //       case ("productivity_" + oldRecord[i].SegmentId):
    //         oldRecord[i].productivity = change.value;
    //         break;
    //       case ("acquisition_" + oldRecord[i].SegmentId):
    //         oldRecord[i].acquisition = change.value;
    //         break;
    //     }
    //   })
    // }
    // oldRecord[0].hurdle = newDetails.hurdle;
    // console.log("oldRecord (updated): ", oldRecord);

    $.ajax({
      method: 'PUT',
      url: '/api/subsegments',
      // data: oldRecord[0],
      data: newDetails,
    });

  };



  // A function for creating a subsegment.
  function upsertRoutes(subsegmentObj) {
    console.log("subsegmentObj in upsert: ", subsegmentObj);

    $.post('/api/subsegments', subsegmentObj[0])
    // .then(getSegments);
  }


  // Function for creating a new list row for segments
  function createSegmentTotals(title, segmentTotals, nextyearSgmtTotals) {

    const totalTr = $('<tr>');
    // totalTr.data('totals', segmentTotals);
    totalTr.append('<td><h4><b>' + title + '</b></h4></td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td><h4><b>$' + segmentTotals + '</b></h4></td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td>' + '</td>');
    totalTr.append('<td><h4><b>$' + nextyearSgmtTotals + '</b></h4></td>');
    return totalTr;
  }



  // Function for creating a new list row for segments

  function createSegmentRow(segmentData) {
    console.log("segmentData: ", segmentData);

    const deal_size_yoy_id = "deal_size_yoy" + segmentData.id;
    const deal_count_yoy_id = "deal_count_yoy" + segmentData.id;

    const newTr = $('<tr>');
    newTr.data('segment', segmentData);

    console.log("rowCount: ", rowCount);

    //For first iteration, include segment information - do not for subsequent rows
    if (rowCount === 0) {
      newTr.append('<td>' + segmentData.name + '</td>');
      newTr.append('<td>$' + segmentData.deal_size + '</td>');
      newTr.append('<td>' + segmentData.deal_count + '</td>');
      newTr.append('<td>$' + segmentData.sgmt_rev + '</td>');

      if (segmentData.deal_size_yoy) {
        newTr.append('<td>' + segmentData.deal_size_yoy + '</td>');
      } else {
        newTr.append('<td>' + ' - ' + '</td>');
      }

      if (segmentData.deal_count_yoy) {
        newTr.append('<td>' + segmentData.deal_count_yoy + '%' + '</td>');
      } else {
        newTr.append('<td>' + '-' + '</td>');
      }

      if (!segmentData.next_year_deal_size) {
        newTr.append('<td>$' + segmentData.deal_size + '</td>');
      }
      else {
        newTr.append('<td>$' + segmentData.next_year_deal_size + '</td>');
      }

      if (!segmentData.next_year_deal_count) {
        newTr.append('<td>$' + segmentData.deal_count + '</td>');
      }
      else {
        newTr.append('<td>$' + segmentData.next_year_deal_count + '</td>');
      }

      if (!segmentData.next_year_sgmt_rev) {
        newTr.append('<td>$' + segmentData.sgmt_rev + '</td>');
      }
      else {
        newTr.append('<td>$' + segmentData.next_year_sgmt_rev + '</td>');
      };
    } else {
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
      newTr.append('<td></td>');
    }

    return newTr;
  }
  // End of createSegmentRow 

  // function createBlankRow for creating a blank row at the end
  function createBlankRow(segmentData) {
    // console.log("segmentData: ", segmentData);
    console.log("nextSubsegmentId: ", nextSubsegmentId);
    if (!nextSubsegmentId) {
      nextSubsegmentId = segmentId + "0";
      console.log("nextSubsegmentId: ", nextSubsegmentId);
    }

    const newTr = $('<tr>');
    newTr.data('subsegment', segmentData);
    newTr.append('<td>' + '<input id="hurdle_' + nextSubsegmentId + '" placeholder=' + 'E.g. Retention' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="markets_' + nextSubsegmentId + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="buyers_' + nextSubsegmentId + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="offerings_' + nextSubsegmentId + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="productivity_' + nextSubsegmentId + '" value="unchecked">' + '</td>');
    newTr.append('<td>' + '<input class="form-check-input" type="checkbox" id="acquisition_' + nextSubsegmentId + '" value="unchecked">' + '</td>');

    // 11/20 Program Family add-in
    newTr.append('<td>' + '<input class="progfam-input" id="reputation_' + nextSubsegmentId + '" placeholder=' + 'Insert reputation action' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="progfam-input" id="demand_' + nextSubsegmentId + '" placeholder=' + 'Insert demand action' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="progfam-input" id="engagement_' + nextSubsegmentId + '" placeholder=' + 'Insert engagement action' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="progfam-input" id="enablement_' + nextSubsegmentId + '" placeholder=' + 'Insert enablement action' + ' type="text" />' + '</td>');
    newTr.append('<td>' + '<input class="progfam-input" id="intelligence_' + nextSubsegmentId + '" placeholder=' + 'Insert intelligence action' + ' type="text" />' + '</td>');
    // End 11/20 Program Family add-in

    newTr.append('<td>' + '<button type="submit" class="btn btn-primary">Submit > </button>' + '</td>');

    return newTr;
  }
  // End of createBlankRow 


  //This function builds the SubSegment details, to be appended to segmentRowsToAdd
  // function createSubSegmentRow(segmentId) {
  function createSubSegmentRow(NEWsubsegments) {
    // console.log("NEWsubsegments: ", NEWsubsegments);

    //Creating row string for subsegment
    const newTr = $('<tr>');
    newTr.data('subsegment', NEWsubsegments);

    const subsegmentDetails = {
      id: NEWsubsegments.id,
      hurdle: NEWsubsegments.hurdle,
      markets: NEWsubsegments.markets,
      buyers: NEWsubsegments.buyers,
      offerings: NEWsubsegments.offerings,
      productivity: NEWsubsegments.productivity,
      acquisition: NEWsubsegments.acquisition,
      SegmentId: NEWsubsegments.SegmentId,
      RouteId: NEWsubsegments.RouteId
      // togId: menuvarId,
      // togValue: menuvar
    };

    console.log("subsegmentDetails: ", subsegmentDetails);
    console.log("Check if subsegmentsData already populated: ", subsegmentsData);


    //Building up array of subsegment detail objects (for this segment)
    subsegmentsData.push(subsegmentDetails);
    // console.log("subsegmentsData: ", subsegmentsData);

    if ((subsegmentDetails.SegmentId.toString() === segmentId) && (subsegmentDetails.RouteId != RouteIdRef)) {
      // console.log("segmentId found:", segmentId);

      let hurdle_value;
      if (subsegmentDetails.hurdle) {
        hurdle_value = '"' + subsegmentDetails.hurdle + '"'
      } else {
        hurdle_value = '"E.g. Retention"';
      }

      const markets_value = subsegmentDetails.markets;
      // console.log("markets_value: ", markets_value);
      const buyers_value = subsegmentDetails.buyers;
      // console.log("buyers_value: ", buyers_value);
      const offerings_value = subsegmentDetails.offerings;
      // console.log("offerings_value: ", offerings_value);
      const productivity_value = subsegmentDetails.productivity;
      // console.log("productivity_value: ", productivity_value);
      const acquisition_value = subsegmentDetails.acquisition;
      // console.log("acquisition_value: ", acquisition_value);

      const hurdleScript = '<td>' + '<input id="hurdle_' + subsegmentDetails.RouteId + '" placeholder=' + hurdle_value + ' type="text" />' + '</td>'
      newTr.append(hurdleScript);

      // Setting checkboxes to checked or unchecked, depending on results from GET from Subsegments table
      let marketsScript = "";
      let marketsUnchecked = '<td>' + '<input class="form-check-input" type="checkbox" id="markets_' + subsegmentDetails.RouteId + '" value="unchecked"' + '>' + '</td>';
      let marketsChecked = '<td>' + '<input class="form-check-input" type="checkbox" checked="checked" id="markets_' + subsegmentDetails.RouteId + '" value="checked"' + '>' + '</td>';

      if (markets_value == "checked") {
        marketsScript = marketsChecked;
      } else {
        marketsScript = marketsUnchecked;
      }
      newTr.append(marketsScript);

      let buyersScript = "";
      let buyersUnchecked = '<td>' + '<input class="form-check-input" type="checkbox" id="buyers_' + subsegmentDetails.RouteId + '" value="unchecked"' + '>' + '</td>';
      let buyersChecked = '<td>' + '<input class="form-check-input" type="checkbox" checked="checked" id="buyers_' + subsegmentDetails.RouteId + '" value="checked"' + '>' + '</td>';

      if (buyers_value == "checked") {
        buyersScript = buyersChecked;
      } else {
        buyersScript = buyersUnchecked;
      }
      newTr.append(buyersScript);

      let offeringsScript = "";
      let offeringsUnchecked = '<td>' + '<input class="form-check-input" type="checkbox" id="offerings_' + subsegmentDetails.RouteId + '" value="unchecked"' + '>' + '</td>';
      let offeringsChecked = '<td>' + '<input class="form-check-input" type="checkbox" checked="checked" id="offerings_' + subsegmentDetails.RouteId + '" value="checked"' + '>' + '</td>';

      if (offerings_value == "checked") {
        offeringsScript = offeringsChecked;
      } else {
        offeringsScript = offeringsUnchecked;
      }
      newTr.append(offeringsScript);

      let productivityScript = "";
      let productivityUnchecked = '<td>' + '<input class="form-check-input" type="checkbox" id="productivity_' + subsegmentDetails.RouteId + '" value="unchecked"' + '>' + '</td>';
      let productivityChecked = '<td>' + '<input class="form-check-input" type="checkbox" checked="checked" id="productivity_' + subsegmentDetails.RouteId + '" value="checked"' + '>' + '</td>';

      if (productivity_value == "checked") {
        productivityScript = productivityChecked;
      } else {
        productivityScript = productivityUnchecked;
      }
      newTr.append(productivityScript);

      let acquisitionScript = "";
      let acquisitionUnchecked = '<td>' + '<input class="form-check-input" type="checkbox" id="acquisition_' + subsegmentDetails.RouteId + '" value="unchecked"' + '>' + '</td>';
      let acquisitionChecked = '<td>' + '<input class="form-check-input" type="checkbox" checked="checked" id="acquisition_' + subsegmentDetails.RouteId + '" value="checked"' + '>' + '</td>';

      if (acquisition_value == "checked") {
        acquisitionScript = acquisitionChecked;
      } else {
        acquisitionScript = acquisitionUnchecked;
      }
      newTr.append(acquisitionScript);

      console.log("subsegmentDetails: ", subsegmentDetails);
      const repTogId = 'repTog_'+subsegmentDetails.RouteId;
      const demTogId = 'demTog_'+subsegmentDetails.RouteId;
      const engTogId = 'engTog_'+subsegmentDetails.RouteId;
      const enabTogId = 'enabTog_'+subsegmentDetails.RouteId;
      const intTogId = 'intTog_'+subsegmentDetails.RouteId;

      //12/10 Commenting out dropdowm button
      /* <div class="dropdown"> */
      // newTr.append('<td><button class="btn btn-default dropdown-toggle "type="button" id="menu1" data-toggle="dropdown"  data-toggle="collapse">Program Type<span class="caret"></span></button><ul class="dropdown-menu" role="menuitem" aria-labelledby="menu1" data-toggle="collapse"><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + repTogId + '" data-toggle="collapse">Reputation</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + demTogId + '" data-toggle="collapse">Demand</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + engTogId + '" data-toggle="collapse">Engagement</a></li><li role="presentation" class="divider"></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + enabTogId + '" data-toggle="collapse">Enablement</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + intTogId + '" data-toggle="collapse">Intelligence</a></li></ul></td>');
      // newTr.append('<td><button class="btn btn-default dropdown-toggle "type="button" id="menu1" data-toggle="dropdown">Program Type<span class="caret"></span></button><ul class="dropdown-menu" role="menuitem" aria-labelledby="menu1" data-toggle="collapse"><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + repTogId + '" data-toggle="collapse">Reputation</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + demTogId + '" data-toggle="collapse">Demand</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + engTogId + '" data-toggle="collapse">Engagement</a></li><li role="presentation" class="divider"></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + enabTogId + '" data-toggle="collapse">Enablement</a></li><li role="presentation"><a role="menuitem" tabindex="-1" href="#" class="ddSelect" id="' + intTogId + '" data-toggle="collapse">Intelligence</a></li></ul></td>');
      // newTr.append('<td>' + menuvar + "</td>");
      // </div>
      //12/10 End of commenting out

      newTr.append('<td>' + '<input class="progfam-input" id="reputation_' + subsegmentDetails.RouteId + '" placeholder=' + 'Insert reputation action' + ' type="text" />' + '</td>');
      newTr.append('<td>' + '<input class="progfam-input" id="demand_' + subsegmentDetails.RouteId + '" placeholder=' + 'Insert demand action' + ' type="text" />' + '</td>');
      newTr.append('<td>' + '<input class="progfam-input" id="engagement_' + subsegmentDetails.RouteId + '" placeholder=' + 'Insert engagement action' + ' type="text" />' + '</td>');
      newTr.append('<td>' + '<input class="progfam-input" id="enablement_' + subsegmentDetails.RouteId + '" placeholder=' + 'Insert enablement action' + ' type="text" />' + '</td>');
      newTr.append('<td>' + '<input class="progfam-input" id="intelligence_' + subsegmentDetails.RouteId + '" placeholder=' + 'Insert intelligence action' + ' type="text" />' + '</td>');

      newTr.append('<td>' + '<button class="btn btn-success update"> Save </button>' + '</td>');
      newTr.append('<td><a style=\'cursor:pointer;color:red\' class=\'delete-subsegment\'>X</a></td>');

      newTr.append('</tr>');
    }

    RouteIdRef = subsegmentDetails.RouteId;
    console.log("RouteIdRef: ", RouteIdRef);

    //UNHIDE IF CHARTS REQUIRED ON SUBSEGMENTS PAGE
    // buildChartObject(segmentData);

    return newTr;
  };
  // End of createSubSegmentRow



  // This function grabs NEWsubsegments from the database and updates the view
  //10.02 Calling this function from 76 not 49 (so only pulling records with specific segmentId)
  // function getSubSegmentDetails() {
  // function getSubSegmentDetails(subsegmentsData) {
  //   console.log("subsegmentsData: ", subsegmentsData);

  //   for (let i = 0; i < subsegmentsData.length; i++) {

  //     segmentId = subsegmentsData[i].id || '';
  //     console.log("subsegmentsData[i].id: ", subsegmentsData[i].id);
  //     console.log("segmentId: ", segmentId);

  //     if (segmentId) {
  //       segmentId = '/?segment_id=' + segmentId;
  //     }
  //     $.get('/api/subsegments' + segmentId, function (data) {
  //       console.log('SubSegment data', data);
  //       subsegments = data;
  //     });
  //   }
  //   console.log("subsegments: ", subsegments);
  // };




  // A function for rendering the list of segments to the page
  function rendersegmentList(rows) {
    segmentList.children().not(':last').remove();
    segmentContainer.children('.alert').remove();
    if (rows.length) {
      // segmentList.prepend(rows);
      $("#segment-table")
        // .find('tbody')
        .find('thead')
        .append(rows);
    } else {
      renderEmpty();
    }
  }

  // A function for rendering the list of segments to the page
  function renderSubsegmentList(rows) {
    subsegmentList.children().not(':last').remove();
    subsegmentContainer.children('.alert').remove();
    if (rows.length) {
      // subsegmentList.prepend(rows);
      $("#subsegments-table")
        .find('tbody')
        .prepend(rows);
    } else {
      renderEmpty();
    }
  }




  // This populates the object for the Revenue Bubble Chart(s)
  function buildChartObject(segmentData) {

    chart1Data.push({
      x: segmentData.deal_size,
      y: segmentData.deal_count,
      r: (segmentData.sgmt_rev / 100)
    });

    chart2Data.push({
      x: segmentData.next_year_deal_size,
      y: segmentData.next_year_deal_count,
      r: (segmentData.next_year_sgmt_rev / 100)
    });

    renderChart1(chart1Data);
    renderChart2(chart2Data);

  }

  // This creates the display object for the Revenue Bubble Chart(s)
  // function renderChart1(chartData) {
  //   var ctx = $('#myBubbleChart1');

  //   var myBubbleChart = new Chart(ctx, {
  //     type: 'bubble',
  //     data: {
  //       "datasets": [{
  //         label: "Segment Revenue - This Year",
  //         data: chart1Data,
  //         backgroundColor:
  //           'red'
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         xAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Deal Size ($)',
  //           },
  //           ticks: {
  //             beginAtZero: false
  //           }
  //         }],
  //         yAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Deal Count (#)',
  //           },
  //           ticks: {
  //             beginAtZero: false
  //           },
  //         }],
  //       }
  //     }
  //   });

  //   ctx.prepend(myBubbleChart);
  // }

  // // This creates the display object for the Revenue Bubble Chart(s)
  // function renderChart2(chartData) {
  //   var ctx = $('#myBubbleChart2');

  //   var myBubbleChart = new Chart(ctx, {
  //     type: 'bubble',
  //     data: {
  //       "datasets": [{
  //         label: "Next Year Segment Revenue Plan",
  //         data: chart2Data,
  //         backgroundColor:
  //           'green'
  //       }]
  //     },
  //     options: {
  //       scales: {
  //         xAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Deal Size ($)',
  //           },
  //           ticks: {
  //             beginAtZero: false
  //           }
  //         }],
  //         yAxes: [{
  //           scaleLabel: {
  //             display: true,
  //             labelString: 'Deal Count (#)',
  //           },
  //           ticks: {
  //             beginAtZero: false
  //           }
  //         }],
  //       }
  //     }
  //   });

  //   ctx.prepend(myBubbleChart);
  // }


  // Function for handling what to render when there are no segments
  // function renderEmpty() {
  //   const alertDiv = $('<div>');
  //   alertDiv.addClass('alert alert-danger');
  //   alertDiv.text('You must create a Segment before you can create a SubSegment.');
  //   segmentContainer.append(alertDiv);
  // }

});