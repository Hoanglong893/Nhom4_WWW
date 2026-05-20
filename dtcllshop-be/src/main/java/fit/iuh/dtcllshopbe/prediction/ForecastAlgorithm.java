package fit.iuh.dtcllshopbe.prediction;

import fit.iuh.dtcllshopbe.dto.prediction.ForecastResult;
import fit.iuh.dtcllshopbe.dto.prediction.TimeSeriesData;

public interface ForecastAlgorithm {
    ForecastResult forecast(TimeSeriesData historicalData, int numberOfPeriods);
    String getName();
}
