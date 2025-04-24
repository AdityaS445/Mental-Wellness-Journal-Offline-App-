let selectedMood = "";
    let selectedDate = new Date().toISOString().slice(0,10);    

    //emoji-selector eventListener
    document.querySelectorAll(".emoji-selector span").forEach(span => {
        span.addEventListener("click", () => {
            selectedMood = span.getAttribute("data-mood");
            document.querySelectorAll(".emoji-selector span").forEach(s => s.classList.remove("selected"));
            span.classList.add("selected");
        });
    });

    //save mood and note data
    function saveEntry() {
        const note = document.getElementById("note").value;
        const dateKey = selectedDate;
        if(!selectedMood)
            return alert("Please select a mood"); 
        
        // finding the data in localstorage or create new
        const entry = { mood: selectedMood, note: note };
        let data = JSON.parse(localStorage.getItem("moodJournal") || "{}");
        data[dateKey] = entry; //taking data and saving 
        localStorage.setItem("moodJournal", JSON.stringify(data)); //saving into localStorage

        alert("Mood saved for " + dateKey);

        //reset emoji and note to new 
        document.getElementById("note").value = "";
        selectedMood = "";
        selectedDate = new Date().toISOString().slice(0, 10);
        document.querySelectorAll(".emoji-selector span").forEach(s => s.classList.remove("selected"));
        renderCalendar(); //refresh the calender with the data saved/modified
    }

    function renderCalendar() {
      const calendar = document.getElementById("calendar");
      calendar.innerHTML = "";

      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth();
      //calculate number of days in a month
      const daysInMonth = new Date(year, month + 1, 0).getDate(); 
      const data = JSON.parse(localStorage.getItem("moodJournal") || "{}");

      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dateStr = date.toISOString().slice(0, 10);
        const entry = data[dateStr];

        const div = document.createElement("div");
        div.className = "day";
        //add mood or empty if none
        div.innerHTML = `<div class='day-number'>${i}</div>${entry ? `<div class='day-mood'>${entry.mood}</div>` : "<div class='day-empty'>-</div>"}`;
        if (entry) div.title = entry.note;

        // direct calender date clicking changes
        div.addEventListener("click", () => {
          selectedDate = dateStr;

          if (entry) {
            //add the mood on date to edit changes in calendar
            selectedMood = entry.mood;
            document.getElementById("note").value = entry.note;
            document.querySelectorAll(".emoji-selector span").forEach(s => s.classList.remove("selected"));
            const emojiBtn = document.querySelector(`.emoji-selector span[data-mood='${entry.mood}']`);
            if (emojiBtn) emojiBtn.classList.add("selected");
          } else {
            //reset if no entry
            selectedMood = "";
            document.getElementById("note").value = "";
            document.querySelectorAll(".emoji-selector span").forEach(s => s.classList.remove("selected"));
          }
          alert("Editing entry for: " + dateStr);
        });

        calendar.appendChild(div); //adding day to calendar
      }
    }

    //exporting data to JSON file
    function exportData() {
      const data = JSON.parse(localStorage.getItem("moodJournal") || "{}");
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      //create a trigger and download link
      const a = document.createElement("a");
      a.href = url;
      a.download = "moodJournal.json";
      a.click();
    }

    //toggle button for light and dark theme
    function toggleDarkMode() {

        document.body.classList.toggle("dark");
        const toggleBtn = document.getElementById("themeToggle");
        if (document.body.classList.contains("dark")) {
          toggleBtn.textContent = "Light Mode";
        } else {
          toggleBtn.textContent = "Dark Mode";
        }
    }

    //initializing the calendar when page loads
    renderCalendar();