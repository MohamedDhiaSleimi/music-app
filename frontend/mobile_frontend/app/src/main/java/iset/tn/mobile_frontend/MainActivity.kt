package iset.tn.mobile_frontend

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import iset.tn.mobile_frontend.R
import iset.tn.mobile_frontend.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Initialisation du binding
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Initialisation du NavController
        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController

        // Appliquer edge-to-edge et gérer les insets
        enableEdgeToEdge()

        // NE PAS appeler checkUserLoginStatus() ici - la navigation est gérée par le nav_graph
    }

    private fun enableEdgeToEdge() {
        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { v, insets ->
            val systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom)
            insets
        }
    }

    // Fonction pour accéder au NavController depuis les fragments
    fun getNavController(): NavController = navController

    fun setUserLoggedIn() {
        // Sauvegarder l'état de connexion
        val sharedPref = getSharedPreferences("session", MODE_PRIVATE)
        sharedPref.edit().putBoolean("isLoggedIn", true).apply()

        // La navigation vers offres est gérée par le LoginFragment
        // NE PAS naviguer depuis ici
    }

    // Supprimez la méthode checkUserLoginStatus() ou gardez-la mais ne l'appelez pas
    private fun checkUserLoginStatus() {
        // Cette méthode peut exister mais ne doit pas être appelée dans onCreate
        // ou alors utilisez-la différemment (voir option 2)
    }

    // Gestion du bouton back pour la navigation
    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp() || super.onSupportNavigateUp()
    }
}