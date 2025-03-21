interface TodayCardProps {
  
    temp: number;
    high: number;
    low: number;
    city: string;
  }
  
  const TodayCard = ({ temp, high, low, city }: TodayCardProps) => {
    return (
      <div className="TodaysCard">
        <div>
        <h2 className="todayText">Today:</h2>
        <p className="tempText">{temp}°</p>
        </div>

      <div>
        <p className="text">High:</p>
        <p className="tempText">{high}°</p>
        </div>
        <div>
        <p className="text">Low:</p>
        <p className="tempText">{low}°</p>
        </div>

        <div>
        <p className="cityText">
          📍 <span className="">{city}</span>
        </p>
        </div>
      </div>
    );
  };
  
  export default TodayCard;
  
