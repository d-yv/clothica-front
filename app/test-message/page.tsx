import MessageNoInfo from "@/components/common/MessageNoInfo/MessageNoInfo";

export default function TestMessagePage() {
    return (
        <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <MessageNoInfo
                text="За вашим запитом не знайдено жодних товарів, спробуйте змінити фільтри, або скинути їх"
                buttonText="Скинути фільтри"
                route="/categories"
            />
        </main>
    );
}
