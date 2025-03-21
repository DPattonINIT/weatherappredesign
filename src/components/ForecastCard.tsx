interface ForecastCardProps {
  day: string; 
  temp: number;
}

const ForecastCard = ({ day, temp,  }: ForecastCardProps) => {
  return (
    <div className="forecastLayout">
      <h1 className="forecastDay">{day}</h1> 
      <p className="forecastTemp">{temp}°</p>
    </div>
  );
};

export default ForecastCard;
