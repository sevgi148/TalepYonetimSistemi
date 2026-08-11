namespace RequestManagement.Application.DTOs;

public record DashboardOzetDto(
    int ToplamTalepSayisi,
    int YeniTalepSayisi,
    int IslemdekiTalepSayisi,
    int TamamlananTalepSayisi,
    int IptalTalepSayisi
);