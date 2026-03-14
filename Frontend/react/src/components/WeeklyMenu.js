import React from "react";

const WeeklyMenu = ({ messMenu, setMessMenu }) => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
  const meals = ["Breakfast", "Lunch", "Snacks", "Dinner"];

  const handleInputChange = (day, meal, value) => {
    const updatedMenu = { ...messMenu, [day]: { ...messMenu[day], [meal]: value } };
    setMessMenu(updatedMenu);
  };

  return (
    <div className="weekly-menu-grid">
      {/* Header Row */}
      <div ></div>
      {meals.map((meal) => (
        <div key={meal} className="menu-header">
          {meal}
        </div>
      ))}
      {/* Grid for Each Day */}
      {days.map((day) => (
        <React.Fragment key={day}>
          <div className="menu-day-name">{day}</div>
          {meals.map((meal) => (
            <div key={`${day}-${meal}`} className="meal-cell">
              <input
                type="text"
                placeholder={`${meal} menu`}
                value={messMenu[day]?.[meal] || ""}
                onChange={(e) => handleInputChange(day, meal, e.target.value)}
              />
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default WeeklyMenu;
